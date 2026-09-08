import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Camera, Wand2, IndianRupee, ScrollText, CheckCircle2, ArrowRight, Square } from "lucide-react";
import { AppShell, SpeakButton } from "@/components/AppShell";
import { BigButton, Card, Pill } from "@/components/ui-bits";
import { useApp } from "@/lib/app-state";
import { VOICE_SCRIPT, VOICE_SCRIPT_EN } from "@/lib/mock";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a listing by voice — SHILPSETU" },
      {
        name: "description",
        content: "Speak in your language, add a photo, and SHILPSETU turns it into a priced, story-rich listing.",
      },
      { property: "og:title", content: "Create a listing by voice — SHILPSETU" },
      { property: "og:description", content: "Voice to structured listing with fair pricing and heritage story." },
    ],
  }),
  component: CreateFlow,
});

const STEPS = ["Speak", "Photo", "Details", "Price", "Story", "Approve"];

function CreateFlow() {
  const { enqueue, online } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [thinking, setThinking] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fields, setFields] = useState({
    name: "Jaipur Blue Pottery Water Jug",
    category: "Home & Kitchen › Pottery",
    material: "Quartz clay with cobalt oxide glaze",
    size: '8 inch height, 1.2 litre',
    time: "14 days",
    stock: "6",
    care: "Hand wash, avoid direct flame",
  });
  const [price, setPrice] = useState(1450);

  // simulated speech-to-text
  useEffect(() => {
    if (!recording) return;
    let i = 0;
    const t = setInterval(() => {
      i += 4;
      setTranscript(VOICE_SCRIPT.slice(0, i));
      if (i >= VOICE_SCRIPT.length) {
        clearInterval(t);
        setRecording(false);
      }
    }, 60);
    return () => clearInterval(t);
  }, [recording]);

  const runAI = () => {
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setStep(2);
    }, 1400);
  };

  return (
    <AppShell title="Add a product" subtitle="Voice first · almost no typing">
      <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
            <p className={`mt-1 text-[10px] ${i === step ? "font-semibold text-primary" : "text-muted-foreground"}`}>
              {s}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="space-y-4 text-center">
          <h2 className="font-display text-xl font-semibold">Describe your product out loud</h2>
          <p className="text-sm text-muted-foreground">
            Say what it is, what it&apos;s made of, how long it took, and how many you have. Any language.
          </p>
          <button
            onClick={() => {
              setTranscript("");
              setRecording(true);
            }}
            aria-label="Start recording"
            className={`mx-auto grid size-32 place-items-center rounded-full text-primary-foreground transition ${
              recording ? "animate-pulse bg-destructive" : "bg-primary"
            }`}
          >
            {recording ? <Square className="size-10" /> : <Mic className="size-12" />}
          </button>
          <p className="text-sm font-medium">{recording ? "Listening… speak now" : "Tap the mic and speak"}</p>

          {transcript && (
            <div className="rounded-2xl bg-accent p-4 text-left">
              <p className="text-xs font-semibold text-accent-foreground">What we heard (हिन्दी)</p>
              <p className="mt-1 text-base">{transcript}</p>
              {!recording && (
                <>
                  <p className="mt-3 text-xs font-semibold text-accent-foreground">Translation</p>
                  <p className="text-sm text-muted-foreground">{VOICE_SCRIPT_EN}</p>
                </>
              )}
            </div>
          )}

          <details className="rounded-2xl border border-border p-3 text-left text-sm">
            <summary className="min-h-11 cursor-pointer font-medium">Can&apos;t speak now? Type instead</summary>
            <textarea
              className="mt-2 w-full rounded-2xl border border-border bg-background p-3"
              rows={3}
              placeholder="Blue pottery jug, handmade…"
              onChange={(e) => setTranscript(e.target.value)}
            />
          </details>

          <BigButton className="w-full" disabled={!transcript || recording} onClick={() => setStep(1)}>
            Next: add a photo <ArrowRight className="size-5" />
          </BigButton>
        </Card>
      )}

      {step === 1 && (
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Add a photo</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Your photo</p>
              <div className="grid aspect-square place-items-center rounded-2xl bg-muted text-5xl">🏺</div>
              <Pill tone="muted">Dim light, cluttered floor</Pill>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">AI enhanced</p>
              <div
                className={`grid aspect-square place-items-center rounded-2xl text-5xl transition ${
                  enhanced ? "bg-gradient-to-br from-marigold/40 to-primary/25 shadow-inner" : "bg-muted opacity-40"
                }`}
              >
                🏺
              </div>
              <Pill tone={enhanced ? "success" : "muted"}>
                {enhanced ? "Clean background, true colours" : "Not enhanced yet"}
              </Pill>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <BigButton variant="outline" className="flex-1">
              <Camera className="size-5" /> Take photo
            </BigButton>
            <BigButton className="flex-1" onClick={() => setEnhanced(true)}>
              <Wand2 className="size-5" /> Enhance
            </BigButton>
          </div>
          <p className="text-xs text-muted-foreground">
            Enhancement only fixes light, background and straightening. The craft itself is never altered — buyers see
            the real product.
          </p>
          <BigButton className="w-full" disabled={!enhanced} onClick={runAI}>
            {thinking ? "Understanding your words…" : "Let AI fill the details"}
          </BigButton>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">AI understood this</h2>
            <Pill tone="success">From your voice</Pill>
          </div>
          {Object.entries(fields).map(([k, v]) => (
            <label key={k} className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</span>
              <input
                value={v}
                onChange={(e) => setFields({ ...fields, [k]: e.target.value })}
                className="mt-1 min-h-12 w-full rounded-2xl border border-border bg-background px-4 text-base"
              />
            </label>
          ))}
          <p className="text-xs text-muted-foreground">Tap any line to correct it. Your correction teaches the app.</p>
          <BigButton className="w-full" onClick={() => setStep(3)}>
            Next: fair price <ArrowRight className="size-5" />
          </BigButton>
        </Card>
      )}

      {step === 3 && (
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-semibold">A fair price for this</h2>
          <div className="rounded-2xl bg-accent p-4 text-center">
            <p className="text-xs text-accent-foreground">Suggested range</p>
            <p className="font-display text-3xl font-bold">₹1,250 – ₹1,750</p>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span>Your price</span>
              <span className="inline-flex items-center font-display text-2xl font-bold">
                <IndianRupee className="size-5" />
                {price}
              </span>
            </div>
            <input
              type="range"
              min={900}
              max={2200}
              step={25}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-2 h-3 w-full accent-[oklch(0.52_0.15_38)]"
              aria-label="Set your price"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {price < 1250 ? "Below fair range — you may be underselling your 14 days of work." : price > 1750 ? "Above range — expect slower sales, but premium buyers do pay this." : "Inside the fair range."}
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-border p-3 text-sm">
            <p className="font-semibold">Why this range?</p>
            <Reason label="Material cost" value="₹310" />
            <Reason label="14 days of your work at ₹55/hr" value="₹620" />
            <Reason label="Firing, glaze, packing" value="₹180" />
            <Reason label="Similar jugs sold online (last 60 days)" value="₹1,300 – ₹1,900" />
            <Reason label="Festival demand right now" value="High ↑" />
          </div>
          <SpeakButton
            text="Your fair price range is one thousand two hundred fifty to one thousand seven hundred fifty rupees, because your material cost is three hundred ten rupees and fourteen days of work."
            label="Explain in my language"
          />
          <BigButton className="w-full" onClick={() => setStep(4)}>
            Next: your story <ArrowRight className="size-5" />
          </BigButton>
        </Card>
      )}

      {step === 4 && (
        <Card className="space-y-3">
          <div className="flex items-center gap-2">
            <ScrollText className="size-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Heritage story</h2>
          </div>
          <p className="rounded-2xl bg-accent p-4 text-sm leading-relaxed">
            Shaped without a speck of clay — Jaipur blue pottery uses quartz powder, glass and fuller&apos;s earth, a
            technique carried from Persia to Rajasthan in the 14th century. This jug was turned, dried and
            cobalt-glazed by hand over fourteen days in Kot Jewar.
          </p>
          <div className="flex flex-wrap gap-2">
            <Pill tone="primary">GI craft: Blue Pottery of Jaipur</Pill>
            <Pill tone="primary">Cluster: Kot Jewar</Pill>
            <Pill tone="primary">Natural, lead-free glaze</Pill>
            <Pill tone="primary">Handmade · 14 days</Pill>
          </div>
          <p className="text-xs text-muted-foreground">
            Stories like this lift the price buyers accept by roughly 20–30% in our pilot data.
          </p>
          <div className="flex gap-2">
            <BigButton variant="outline" onClick={() => setStep(3)}>
              Back
            </BigButton>
            <BigButton className="flex-1" onClick={() => setStep(5)}>
              Review everything
            </BigButton>
          </div>
        </Card>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Card className="space-y-3">
            <h2 className="font-display text-xl font-semibold">You approve, then it goes live</h2>
            <div className="flex gap-3">
              <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-marigold/40 to-primary/25 text-4xl">
                🏺
              </div>
              <div>
                <p className="font-semibold">{fields.name}</p>
                <p className="text-sm text-muted-foreground">{fields.material}</p>
                <p className="mt-1 font-display text-xl font-bold">₹{price}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-accent p-3 text-xs">
              Nothing is published until you tap approve. SHILPSETU never posts, prices or replies on your behalf
              without this step.
            </div>
            <SpeakButton text={`${fields.name}, price ${price} rupees, ${fields.stock} pieces ready.`} label="Read it back to me" />
            {!saved ? (
              <BigButton
                className="w-full"
                onClick={() => {
                  enqueue(`${fields.name} — new listing`);
                  setSaved(true);
                }}
              >
                <CheckCircle2 className="size-5" /> Approve &amp; publish
              </BigButton>
            ) : (
              <div className="space-y-3">
                <div className="rounded-2xl bg-success/15 p-4 text-sm text-success-ink">
                  <p className="font-semibold">Saved on your phone ✓</p>
                  <p>
                    {online
                      ? "You are online — it is syncing to the marketplace now."
                      : "You are offline. It will publish automatically the moment a signal returns. Nothing will be lost."}
                  </p>
                </div>
                <BigButton variant="outline" className="w-full" onClick={() => navigate({ to: "/catalog" })}>
                  See it in my catalog
                </BigButton>
              </div>
            )}
          </Card>
        </div>
      )}
    </AppShell>
  );
}

function Reason({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
