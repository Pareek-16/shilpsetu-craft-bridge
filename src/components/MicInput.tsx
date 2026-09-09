import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

/** Simulated dictation: tap mic, "listening…", then the spoken value appears. */
export function useDictation(onDone: (v: string) => void, sample: string, ms = 1300) {
  const [listening, setListening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const start = () => {
    if (listening) {
      setListening(false);
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    setListening(true);
    timer.current = setTimeout(() => {
      setListening(false);
      onDone(sample);
    }, ms);
  };
  return { listening, start };
}

export function MicButton({
  onResult,
  sample,
  label = "Speak",
  className,
}: {
  onResult: (v: string) => void;
  sample: string;
  label?: string;
  className?: string;
}) {
  const { listening, start } = useDictation(onResult, sample);
  return (
    <button
      type="button"
      onClick={start}
      aria-label={listening ? "Stop listening" : label}
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl border border-border transition",
        listening ? "animate-pulse bg-destructive text-primary-foreground" : "bg-card text-primary",
        className,
      )}
    >
      {listening ? <Square className="size-4" /> : <Mic className="size-5" />}
    </button>
  );
}

export function MicField({
  label,
  value,
  onChange,
  sample,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  sample: string;
}) {
  const { listening, start } = useDictation(onChange, sample);
  return (
    <div className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="min-h-12 w-full min-w-0 rounded-2xl border border-border bg-background px-4 text-base"
        />
        <button
          type="button"
          onClick={start}
          aria-label={`Speak ${label}`}
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl border border-border transition",
            listening ? "animate-pulse bg-destructive text-primary-foreground" : "bg-card text-primary",
          )}
        >
          {listening ? <Square className="size-4" /> : <Mic className="size-5" />}
        </button>
      </div>
      {listening && <p className="mt-1 text-xs text-destructive">Listening… say the {label.toLowerCase()}</p>}
    </div>
  );
}
