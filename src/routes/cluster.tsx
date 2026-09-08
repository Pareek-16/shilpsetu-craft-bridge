import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Section } from "@/components/AppShell";
import { BigButton, Card, Pill, Stat } from "@/components/ui-bits";
import { CLUSTER } from "@/lib/mock";

export const Route = createFileRoute("/cluster")({
  head: () => ({
    meta: [
      { title: "My SHG cluster — SHILPSETU" },
      { name: "description", content: "Self-help group and craft cluster showcase: shared capacity, pooled earnings and split bulk orders." },
      { property: "og:title", content: "My SHG cluster — SHILPSETU" },
      { property: "og:description", content: "Artisan collectives selling together." },
    ],
  }),
  component: Cluster,
});

function Cluster() {
  return (
    <AppShell title="My cluster" subtitle={`${CLUSTER.name} · ${CLUSTER.district}`}>
      <Card className="bg-gradient-to-br from-primary/12 to-marigold/20">
        <h2 className="font-display text-xl font-bold">{CLUSTER.name}</h2>
        <p className="text-sm text-muted-foreground">{CLUSTER.district}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill tone="primary">{CLUSTER.members} members</Pill>
          <Pill tone="primary">GI craft cluster</Pill>
          <Pill tone="success">Verified SHG</Pill>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Pooled earnings" value={`₹${(CLUSTER.pooled / 1000).toFixed(0)}k`} hint="this quarter" />
        <Stat label="Monthly capacity" value={`${CLUSTER.capacity}`} hint="pieces" />
        <Stat label="Shared orders" value={`${CLUSTER.orders}`} hint="split fairly" />
        <Stat label="Members earning" value="24/24" hint="all active" />
      </div>

      <Section title="Members">
        <div className="grid gap-3 sm:grid-cols-2">
          {CLUSTER.people.map((p) => (
            <Card key={p.name} className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-accent text-2xl">{p.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.craft}</p>
              </div>
              <Pill tone="muted">{p.items} items</Pill>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Split a bulk order">
        <Card className="space-y-3">
          <p className="text-sm">
            500 terracotta diya sets in 25 days. Suggested split so nobody is overloaded:
          </p>
          {[
            ["Sunita Das", 160],
            ["Ratan Kumbhakar", 120],
            ["Jharna Bauri", 110],
            ["Other 21 members", 110],
          ].map(([n, v]) => (
            <div key={n as string}>
              <div className="flex justify-between text-sm">
                <span>{n}</span>
                <span className="font-medium">{v} sets</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${((v as number) / 160) * 100}%` }} />
              </div>
            </div>
          ))}
          <BigButton className="w-full">Propose split to cluster</BigButton>
          <p className="text-xs text-muted-foreground">
            Each member sees the proposal in their own language and approves their share.
          </p>
        </Card>
      </Section>
    </AppShell>
  );
}
