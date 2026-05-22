interface ChecklistProps {
  items: string[];
  checkedFirst?: boolean;
}

export function Checklist({ items, checkedFirst = true }: ChecklistProps) {
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <label
          key={item}
          className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-midnight/45 px-3 text-sm text-white"
        >
          <input
            type="checkbox"
            defaultChecked={checkedFirst && index === 0}
            className="size-5 rounded border-white/20 bg-midnight text-lavender focus:ring-lavender/40"
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
