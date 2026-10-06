# SPY 8/21 EMA crossover options strategy

This is OptionMillionaire's 8/21 EMA setup (from ColeJustice's "SPY Moving Averages and Signals" v2.4) turned into a backtestable strategy:

- **Calls** when the 8 EMA crosses over the 21 EMA
- **Puts** when the 8 EMA crosses under the 21 EMA

Each trade buys one option (ATM, 0DTE by default). Default exits: -30% stop, +50% target, the opposite crossover, or 3:55pm ET.

## 1. TradingView Strategy Tester: `OM_SPY_Options_Strategy.pine`
1. Open a chart of **AMEX:SPY** on the **5m** timeframe and turn **extended hours OFF**.
2. Pine Editor → paste the file → **Add to chart** → open the **Strategy Tester** tab.
3. **Options P&L is in the table in the top-right of the chart.** The table prices each call/put with Black-Scholes, using VIX as IV, and includes theta decay and the spread.
   The Strategy Tester's own numbers come from trading delta-equivalent SPY shares (contracts × 100 × delta), so they only approximate direction.
4. Change DTE, strikes OTM, stop/target, sizing, and the VWAP / 34-EMA filters in the strategy settings.

TradingView's 5m history depends on your plan (about 2–6 months). Use Deep Backtesting on Premium for more.

## 2. Alpaca backtest with real option prices: `alpaca_backtest.py`
```bash
pip install requests pandas numpy
export APCA_API_KEY_ID=your_key APCA_API_SECRET_KEY=your_secret
python alpaca_backtest.py --start 2024-03-01 --end 2025-12-31            # 0DTE ATM, 1 contract
python alpaca_backtest.py --start 2024-03-01 --pct 10 --vwap-filter       # 10% of account per trade, VWAP filter
python alpaca_backtest.py --help                                          # all options
```
The script prints the win rate, net P&L, profit factor, max drawdown and monthly P&L, and writes `trades.csv`.
Alpaca's option history starts in Feb 2024. Any missing option price falls back to Black-Scholes, and the summary reports how many prices were real vs modeled. If you get a SIP permission error on a free account, add `--feed iex`.

Educational tool, not financial advice. 0DTE options can lose 100% fast. A backtest is not a forecast.
