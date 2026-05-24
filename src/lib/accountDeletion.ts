import { supabase } from "./supabase";

export function clearLocalAccountData(userId: string) {
  if (typeof window === "undefined") return;

  const userPrefix = `ybw.users.${userId}.`;
  const keysToRemove: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;

    if (key === "ybw.currentUserId" || key.startsWith(userPrefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
}

export async function deleteCurrentAccount() {
  if (!supabase) {
    throw new Error("Account deletion is not configured yet.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Please sign in again before deleting your account.");
  }

  const userId = userData.user.id;
  const { data, error } = await supabase.functions.invoke<{ message?: string }>("delete-account", {
    body: {}
  });

  if (error) {
    throw new Error(error.message || "Your account could not be deleted. Please try again.");
  }

  clearLocalAccountData(userId);

  try {
    await supabase.auth.signOut();
  } catch {
    window.localStorage.removeItem("ybw.currentUserId");
  }

  return data?.message || "Your account and saved data were deleted.";
}
