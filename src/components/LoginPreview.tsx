import { useEffect, useState } from "react";
import { LockKeyhole, LogIn, LogOut, ShieldCheck } from "lucide-react";

interface ClientPrincipal {
  userDetails?: string;
  identityProvider?: string;
}

export function LoginPreview() {
  const [principal, setPrincipal] = useState<ClientPrincipal | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/.auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { clientPrincipal?: ClientPrincipal | null } | null) => {
        if (isMounted) {
          setPrincipal(data?.clientPrincipal ?? null);
          setCheckedAuth(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPrincipal(null);
          setCheckedAuth(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 shadow-lavender">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Account access</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Secure sign-in</h2>
          <p className="mt-2 text-sm leading-6 text-periwinkle/85">
            Sign in to keep your wellness dashboard private. Your password is handled securely and is never stored in this app.
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-ice/20 bg-ice/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">Signed-in status</p>
            <p className="mt-1 text-sm leading-6 text-periwinkle/85">
              {principal
                ? `Signed in as ${principal.userDetails ?? "Microsoft account"}${principal.identityProvider ? ` with ${principal.identityProvider}` : ""}.`
                : checkedAuth
                  ? "Not signed in on this device."
                  : "Checking sign-in status..."}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href="/.auth/login/aad?post_login_redirect_uri=/app"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <LogIn size={18} aria-hidden="true" />
          Log in or create account
        </a>
        <a
          href="/.auth/logout?post_logout_redirect_uri=/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-periwinkle/85"
        >
          <LogOut size={18} aria-hidden="true" />
          Logout
        </a>
      </div>
    </section>
  );
}
