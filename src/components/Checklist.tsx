import { useEffect, useMemo, useState } from "react";

interface ChecklistProps {
  items: string[];
  checkedFirst?: boolean;
  storageKey?: string;
}

function buildInitialState(items: string[], checkedFirst: boolean) {
  return Object.fromEntries(items.map((item, index) => [item, checkedFirst && index === 0]));
}

function readStoredState(storageKey: string | undefined, fallback: Record<string, boolean>) {
  if (!storageKey || typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? { ...fallback, ...(JSON.parse(stored) as Record<string, boolean>) } : fallback;
  } catch {
    return fallback;
  }
}

export function Checklist({ items, checkedFirst = true, storageKey }: ChecklistProps) {
  const itemsKey = items.join("|");
  const fallback = useMemo(() => buildInitialState(items, checkedFirst), [itemsKey, checkedFirst]);
  const [checked, setChecked] = useState(() => readStoredState(storageKey, fallback));

  useEffect(() => {
    setChecked(readStoredState(storageKey, fallback));
  }, [fallback, storageKey]);

  useEffect(() => {
    if (storageKey) {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    }
  }, [checked, storageKey]);

  const toggle = (item: string) => {
    setChecked((current) => ({ ...current, [item]: !current[item] }));
  };

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <label
          key={item}
          className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white"
        >
          <input
            type="checkbox"
            checked={Boolean(checked[item])}
            onChange={() => toggle(item)}
            className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
