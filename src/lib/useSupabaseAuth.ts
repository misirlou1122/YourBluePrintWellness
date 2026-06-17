import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { clearLocalAccountData } from "./accountDeletion";
import { isSupabaseConfigured, supabase } from "./supabase";

interface SupabaseAuthState {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

export function useSupabaseAuth(): SupabaseAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadSession = async () => {
      const { data } = await client.auth.getSession();
      if (!isMounted) return;

      if (!data.session) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await client.auth.getUser();
      if (!isMounted) return;

      if (userError || !userData.user) {
        setSession(null);
        setUser(null);
        setLoading(false);
        await client.auth.signOut();
        window.localStorage.removeItem("ybw.currentUserId");
        return;
      }

      setSession(data.session);
      setUser(userData.user);
      setLoading(false);
    };

    void loadSession();

    const {
      data: { subscription }
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      client.auth.getUser().then(({ data: userData, error: userError }) => {
        if (!isMounted) return;

        if (userError || !userData.user) {
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setSession(nextSession);
        setUser(userData.user);
        setLoading(false);
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const client = supabase;
    if (!client) return;

    const userId = user?.id ?? (typeof window !== "undefined" ? window.localStorage.getItem("ybw.currentUserId") ?? "" : "");
    await client.auth.signOut();

    if (userId) {
      clearLocalAccountData(userId);
    } else {
      window.localStorage.removeItem("ybw.currentUserId");
    }

    setSession(null);
    setUser(null);
  };

  return {
    configured: isSupabaseConfigured,
    loading,
    session,
    user,
    signOut
  };
}
