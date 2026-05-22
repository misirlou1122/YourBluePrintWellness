import { useEffect, useState } from "react";

export interface LocalItem {
  id: string;
}

export interface CompletableItem extends LocalItem {
  completed?: boolean;
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addItem<T extends LocalItem>(items: T[], item: Omit<T, "id"> & Partial<Pick<T, "id">>, prefix = "item") {
  return [{ ...item, id: item.id ?? createId(prefix) } as T, ...items];
}

export function updateItem<T extends LocalItem>(items: T[], id: string, updates: Partial<T>) {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export function deleteItem<T extends LocalItem>(items: T[], id: string) {
  return items.filter((item) => item.id !== id);
}

export function toggleComplete<T extends CompletableItem>(items: T[], id: string) {
  return items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item));
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function useLocalCollection<T extends LocalItem>(key: string, initialValue: T[] = [], prefix = "item") {
  const [items, setItems] = useLocalStorage<T[]>(key, initialValue);

  return {
    items,
    setItems,
    add: (item: Omit<T, "id"> & Partial<Pick<T, "id">>) => setItems((current) => addItem(current, item, prefix)),
    update: (id: string, updates: Partial<T>) => setItems((current) => updateItem(current, id, updates)),
    remove: (id: string) => setItems((current) => deleteItem(current, id)),
    toggleComplete: (id: string) => setItems((current) => toggleComplete(current as unknown as CompletableItem[], id) as unknown as T[])
  };
}
