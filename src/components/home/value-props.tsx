import { Clock, Leaf, HeartHandshake, Truck } from "lucide-react";

const props = [
  { icon: Clock, title: "5-minute looks", desc: "Tools designed for speed, not skill." },
  { icon: Leaf, title: "Clean & vegan", desc: "Cruelty-free formulas, kind ingredients." },
  { icon: HeartHandshake, title: "Under $30", desc: "Affordable glam that doesn't skimp." },
  { icon: Truck, title: "Fast & free $35+", desc: "Ships in 1–2 days, tracked to your door." },
];

export function ValueProps() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
        {props.map((p) => (
          <div key={p.title} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">{p.title}</h3>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
