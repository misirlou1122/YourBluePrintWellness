import { Component, type ErrorInfo, type ReactNode } from "react";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  message: string;
}

const recoverableKeys = [
  "ybw.activeTile",
  "ybw.customTileIds",
  "ybw.dailyTrackers",
  "ybw.lastDailyTrackingDate",
  "ybw.wellnessProfile"
];

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: ""
  };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Your Blueprint Wellness recovered from an app error:", error, info.componentStack);
  }

  resetDashboard = () => {
    const userId = window.localStorage.getItem("ybw.currentUserId");
    const userPrefix = userId ? `ybw.users.${userId}.` : "";

    for (const key of recoverableKeys) {
      window.localStorage.removeItem(key);
      if (userPrefix) {
        window.localStorage.removeItem(`${userPrefix}${key}`);
      }
    }

    window.location.assign("/app");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="mx-auto grid min-h-screen w-full max-w-3xl content-center gap-5 px-4 pb-[env(safe-area-inset-bottom)] pt-4 sm:px-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">Let’s reopen your dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-periwinkle/85">
            Something saved in this browser did not load cleanly. Your account is still okay.
          </p>
          <button
            type="button"
            onClick={this.resetDashboard}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-5 py-4 text-sm font-semibold text-white shadow-glow"
          >
            Recover dashboard
          </button>
          {this.state.message ? <p className="mt-4 text-xs leading-5 text-periwinkle/65">Error: {this.state.message}</p> : null}
        </section>
        <MedicalDisclaimer />
      </main>
    );
  }
}
