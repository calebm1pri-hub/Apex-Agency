#!/usr/bin/env python3
"""
Backtest OM's 8/21 EMA crossover on SPY 5-minute bars from Alpaca, trading SPY OPTIONS.

  8 EMA crosses over 21 EMA  -> buy a call
  8 EMA crosses under 21 EMA -> buy a put

Option prices come from Alpaca's historical option bars (available from Feb 2024).
If a contract has no bar at that time, the price falls back to Black-Scholes.
The summary says how many prices were real and how many were modeled.

Usage:
  pip install requests pandas numpy
  export APCA_API_KEY_ID=...  APCA_API_SECRET_KEY=...
  python alpaca_backtest.py --start 2024-03-01 --end 2024-12-31
  python alpaca_backtest.py --start 2024-03-01 --dte 1 --stop 30 --target 50 --vwap-filter
"""
import argparse
import math
import os
import sys
from datetime import date, datetime, timedelta

import numpy as np
import pandas as pd
import requests

DATA = "https://data.alpaca.markets"
NY = "America/New_York"


# ───────────── Alpaca data ─────────────
def _get(path, params):
    key, sec = os.environ.get("APCA_API_KEY_ID"), os.environ.get("APCA_API_SECRET_KEY")
    if not key or not sec:
        sys.exit("Set APCA_API_KEY_ID and APCA_API_SECRET_KEY (free Alpaca account works).")
    out, token = {}, None
    while True:
        p = dict(params, limit=10000)
        if token:
            p["page_token"] = token
        r = requests.get(DATA + path, params=p, timeout=30,
                         headers={"APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": sec})
        r.raise_for_status()
        j = r.json()
        for sym, bars in (j.get("bars") or {}).items():
            out.setdefault(sym, []).extend(bars)
        token = j.get("next_page_token")
        if not token:
            return out


def _frame(bars):
    df = pd.DataFrame(bars)
    if df.empty:
        return df
    df["t"] = pd.to_datetime(df["t"], utc=True).dt.tz_convert(NY)
    return df.set_index("t").sort_index()


def stock_bars(start, end, feed):
    raw = _get("/v2/stocks/bars", {"symbols": "SPY", "timeframe": "5Min", "start": start,
                                   "end": end, "adjustment": "raw", "feed": feed})
    df = _frame(raw.get("SPY", []))
    if df.empty:
        sys.exit("No SPY bars returned. Check dates / data feed (--feed iex for free accounts).")
    mins = df.index.hour * 60 + df.index.minute
    return df[(mins >= 570) & (mins < 960)]  # regular hours 09:30-16:00


_opt_cache = {}


def option_bars(symbol, day_from, day_to):
    k = (symbol, day_from, day_to)
    if k not in _opt_cache:
        try:
            raw = _get("/v1beta1/options/bars", {"symbols": symbol, "timeframe": "5Min",
                                                 "start": f"{day_from}T13:00:00Z",
                                                 "end": f"{day_to}T21:00:00Z"})
            _opt_cache[k] = _frame(raw.get(symbol, []))
        except requests.HTTPError:
            _opt_cache[k] = pd.DataFrame()
    return _opt_cache[k]


def occ(expiry, is_call, strike):
    return f"SPY{expiry:%y%m%d}{'C' if is_call else 'P'}{int(round(strike * 1000)):08d}"


# ───────────── Indicators ─────────────
def ma(s, n, typ):
    if typ == "EMA":
        return s.ewm(span=n, adjust=False).mean()
    if typ == "SMA":
        return s.rolling(n).mean()
    w = np.arange(1, n + 1)
    if typ == "WMA":
        return s.rolling(n).apply(lambda x: np.dot(x, w) / w.sum(), raw=True)
    raise ValueError(typ)


# ───────────── Black-Scholes fallback ─────────────
def ncdf(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))


def bs(is_call, S, K, T, r, v):
    T = max(T, 5 / 525600)
    sq = v * math.sqrt(T)
    d1 = (math.log(S / K) + (r + 0.5 * v * v) * T) / sq
    d2 = d1 - sq
    if is_call:
        return max(S * ncdf(d1) - K * math.exp(-r * T) * ncdf(d2), 0.01)
    return max(K * math.exp(-r * T) * ncdf(-d2) - S * ncdf(-d1), 0.01)


def years_to_expiry(ts, expiry):
    exp_dt = pd.Timestamp(datetime.combine(expiry, datetime.min.time())).tz_localize(NY) + pd.Timedelta(hours=16)
    return max((exp_dt - ts).total_seconds() / 60, 5) / 525600


# ───────────── Backtest ─────────────
def run(a):
    df = stock_bars(a.start, a.end, a.feed)
    c = df["c"]
    df["short"] = ma(c, a.short, a.ma_type)
    df["long"] = ma(c, a.long, a.ma_type)
    df["bonus"] = ma(c, a.bonus, "EMA")
    day = df.index.date
    pv = ((df["h"] + df["l"] + df["c"]) / 3) * df["v"]
    df["vwap"] = pv.groupby(day).cumsum() / df["v"].groupby(day).cumsum()
    up = df["short"] > df["long"]
    df["bull"] = up & ~up.shift(1, fill_value=True)
    df["bear"] = ~up & up.shift(1, fill_value=False) & df["long"].notna()

    days = sorted(set(day))
    def expiry_for(d):
        i = days.index(d) + a.dte
        if i < len(days):
            return days[i]
        e = d
        for _ in range(a.dte):
            e += timedelta(days=1)
            while e.weekday() >= 5:
                e += timedelta(days=1)
        return e

    def price(ts, is_call, K, expiry, S):
        """Real option close at this bar if Alpaca has it, else Black-Scholes."""
        ob = option_bars(occ(expiry, is_call, K), ts.date(), expiry)
        if not ob.empty:
            hit = ob.loc[:ts]
            if not hit.empty and hit.index[-1].date() == ts.date():
                return float(hit["c"].iloc[-1]), True
        return bs(is_call, S, K, years_to_expiry(ts, expiry), a.rate / 100, a.iv / 100), False

    eq, peak, maxdd = a.capital, a.capital, 0.0
    pos, trades, real_px, model_px = None, [], 0, 0
    flat_min = a.flat_hour * 60 + a.flat_minute

    for ts, row in df.iterrows():
        bar_end = ts + pd.Timedelta(minutes=5)
        m = bar_end.hour * 60 + bar_end.minute
        eod = m >= flat_min
        in_win = 9 * 60 + 45 <= m <= 15 * 60 + 30
        call_ok = a.direction != "puts" and (not a.vwap_filter or row.c > row.vwap) and (not a.bonus_filter or row.c > row.bonus)
        put_ok = a.direction != "calls" and (not a.vwap_filter or row.c < row.vwap) and (not a.bonus_filter or row.c < row.bonus)
        go_call = bool(row.bull) and call_ok and in_win and not eod
        go_put = bool(row.bear) and put_ok and in_win and not eod

        if pos:
            mark, real = price(ts, pos["call"], pos["K"], pos["exp"], row.c)
            real_px += real; model_px += not real
            why = None
            if a.stop and mark <= pos["entry"] * (1 - a.stop / 100):
                why = "Stop"
            elif a.target and mark >= pos["entry"] * (1 + a.target / 100):
                why = "Target"
            elif (pos["call"] and row.bear) or (not pos["call"] and row.bull):
                why = "Cross"
            elif eod and (not a.hold_overnight or ts.date() >= pos["exp"]):
                why = "EOD"
            if why:
                exit_px = max(mark - a.slippage, 0.0)
                pnl = (exit_px - pos["entry"]) * 100 * pos["n"] - a.commission * 2 * pos["n"]
                eq += pnl
                peak = max(peak, eq); maxdd = max(maxdd, peak - eq)
                trades.append(dict(entry_time=pos["t"], exit_time=bar_end, side="CALL" if pos["call"] else "PUT",
                                   contract=pos["sym"], contracts=pos["n"], entry=round(pos["entry"], 2),
                                   exit=round(exit_px, 2), pnl=round(pnl, 2), reason=why, equity=round(eq, 2)))
                pos = None

        if not pos and (go_call or go_put):
            is_call = go_call
            K = round(row.c) + (a.otm if is_call else -a.otm)
            exp = expiry_for(ts.date())
            prem, real = price(ts, is_call, K, exp, row.c)
            real_px += real; model_px += not real
            cost = prem + a.slippage
            n = a.contracts if a.pct is None else int(eq * a.pct / 100 // (cost * 100))
            if n >= 1 and eq > cost * 100 * n:
                pos = dict(call=is_call, K=K, exp=exp, entry=cost, n=n, t=bar_end, sym=occ(exp, is_call, K))

    t = pd.DataFrame(trades)
    print(f"\nSPY 8/{a.long} {a.ma_type} cross -> {'0DTE' if a.dte == 0 else f'{a.dte}DTE'} options, "
          f"{a.start} to {a.end}")
    if t.empty:
        print("No trades."); return
    wins, losses = t[t.pnl > 0], t[t.pnl <= 0]
    net = eq - a.capital
    print(f"  Trades:          {len(t)}  ({len(wins)} wins / {len(losses)} losses, {len(wins)/len(t):.1%} win rate)")
    print(f"  Start -> End:    ${a.capital:,.2f} -> ${eq:,.2f}")
    print(f"  Net P&L:         ${net:,.2f}  ({net / a.capital:.1%})")
    print(f"  Avg win / loss:  ${wins.pnl.mean() if len(wins) else 0:,.2f} / ${losses.pnl.mean() if len(losses) else 0:,.2f}")
    pf = wins.pnl.sum() / -losses.pnl.sum() if losses.pnl.sum() < 0 else float("inf")
    print(f"  Profit factor:   {pf:.2f}")
    print(f"  Max drawdown:    ${maxdd:,.2f}")
    print(f"  Exit reasons:    {t.reason.value_counts().to_dict()}")
    print(f"  Option prices:   {real_px} real Alpaca bars, {model_px} Black-Scholes fallback")
    t["month"] = pd.to_datetime(t.exit_time.astype(str).str[:7])
    print("\n  Monthly P&L:")
    for mo, v in t.groupby(t.month.dt.strftime("%Y-%m")).pnl.sum().items():
        print(f"    {mo}  ${v:>10,.2f}")
    t.drop(columns="month").to_csv(a.out, index=False)
    print(f"\n  Trade log -> {a.out}")


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--start", default=(date.today() - timedelta(days=180)).isoformat())
    p.add_argument("--end", default=(date.today() - timedelta(days=1)).isoformat())
    p.add_argument("--feed", default="sip", choices=["sip", "iex"])
    p.add_argument("--short", type=int, default=8)
    p.add_argument("--long", type=int, default=21)
    p.add_argument("--ma-type", default="EMA", choices=["EMA", "SMA", "WMA"])
    p.add_argument("--bonus", type=int, default=34)
    p.add_argument("--direction", default="both", choices=["both", "calls", "puts"])
    p.add_argument("--vwap-filter", action="store_true")
    p.add_argument("--bonus-filter", action="store_true")
    p.add_argument("--dte", type=int, default=0, help="0 = same-day expiry")
    p.add_argument("--otm", type=int, default=0, help="$ strikes out of the money")
    p.add_argument("--hold-overnight", action="store_true", help="for --dte > 0, hold past the close")
    p.add_argument("--flat-hour", type=int, default=15)
    p.add_argument("--flat-minute", type=int, default=55)
    p.add_argument("--stop", type=float, default=30, help="% of premium, 0 = off")
    p.add_argument("--target", type=float, default=50, help="% of premium, 0 = off")
    p.add_argument("--capital", type=float, default=10000)
    p.add_argument("--contracts", type=int, default=1)
    p.add_argument("--pct", type=float, default=None, help="size by %% of account instead of fixed contracts")
    p.add_argument("--slippage", type=float, default=0.02, help="$ per option per side")
    p.add_argument("--commission", type=float, default=0.0, help="$ per contract per side")
    p.add_argument("--iv", type=float, default=16, help="IV %% for Black-Scholes fallback")
    p.add_argument("--rate", type=float, default=4.5)
    p.add_argument("--out", default="trades.csv")
    run(p.parse_args(argv))


if __name__ == "__main__":
    main()
