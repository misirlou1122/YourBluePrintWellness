import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface LocalItem {
  id: string;
}

export interface CompletableItem extends LocalItem {
  completed?: boolean;
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveStorageKey(key: string) {
  if (typeof window === "undefined" || !key.startsWith("ybw.") || key === "ybw.currentUserId") {
    return key;
  }

  const userId = window.localStorage.getItem("ybw.currentUserId");
  return userId ? `ybw.users.${userId}.${key}` : key;
}

function shouldSyncToCloud(key: string) {
  return key.startsWith("ybw.") && key !== "ybw.currentUserId" && key !== "ybw.profileSavedMessage";
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
  const storageKey = resolveStorageKey(key);
  const cloudSyncEnabled = Boolean(supabase && shouldSyncToCloud(key));
  const [cloudReady, setCloudReady] = useState(!cloudSyncEnabled);
  const [cloudUserId, setCloudUserId] = useState("");
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const client = supabase;
    if (!cloudSyncEnabled || !client) {
      setCloudReady(true);
      return;
    }

    let isMounted = true;
    setCloudReady(false);

    client.auth
      .getUser()
      .then(async ({ data: userData, error: userError }) => {
        if (!isMounted) return;

        const authenticatedUserId = userError ? "" : userData.user?.id ?? "";
        setCloudUserId(authenticatedUserId);

        if (!authenticatedUserId) {
          setCloudReady(true);
          return;
        }

        const { data, error } = await client
          .from("wellness_records")
          .select("record_value")
          .eq("user_id", authenticatedUserId)
          .eq("record_key", key)
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.warn("Cloud sync read skipped:", error.message);
          setCloudReady(true);
          return;
        }

        if (data?.record_value !== undefined) {
          setValue(data.record_value as T);
          window.localStorage.setItem(storageKey, JSON.stringify(data.record_value));
        }

        setCloudReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, [cloudSyncEnabled, key, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  useEffect(() => {
    const client = supabase;
    if (!cloudSyncEnabled || !cloudReady || !cloudUserId || !client) {
      return;
    }

    client
      .from("wellness_records")
      .upsert(
        {
          user_id: cloudUserId,
          record_key: key,
          record_value: value,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id,record_key" }
      )
      .then(({ error }) => {
        if (error) {
          console.warn("Cloud sync save skipped:", error.message);
        }
      });
  }, [cloudReady, cloudSyncEnabled, cloudUserId, key, value]);

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
