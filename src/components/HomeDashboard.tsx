import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { profileSummary } from "../data/wellness";
import { getProfileLabel, type WellnessProfileId } from "../data/wellnessProfiles";
import type { TileId, WellnessTile } from "../types/wellness";
import { emptyUserProfile } from "../types/userProfile";
import { formatBmi } from "../lib/bodyMetrics";
import { createId, useLocalStorage } from "../lib/useLocalStorage";
import { TileCard } from "./TileCard";

interface HomeDashboardProps {
  tiles: WellnessTile[];
  selectedProfile: WellnessProfileId;
  onOpenTile: (id: TileId) => void;
  onProfileChange: (profile: WellnessProfileId) => void;
}

interface WeightSummary {
  id: string;
  date: string;
  weight: string;
  unit: "lb" | "kg";
}

const editablePillClass =
  "min-h-9 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-left text-xs font-medium text-periwinkle/85 outline-none transition hover:border-lavender/45 hover:text-white focus-visible:ring-2 focus-visible:ring-ice/50";

function EditableProfilePill({
  label,
  value,
  displayValue,
  placeholder,
  active,
  onStart,
  onSave
}: {
  label: string;
  value: string;
  displayValue: string;
  placeholder?: string;
  active: boolean;
  onStart: () => void;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (active) setDraft(value);
  }, [active, value]);

  if (active) {
    return (
      <label className="inline-grid gap-1 rounded-2xl border border-ice/25 bg-midnight/70 px-3 py-2 text-xs text-ice shadow-ice">
        <span>{label}</span>
        <input
          autoFocus
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => onSave(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") onSave(value);
          }}
          className="min-h-9 w-36 rounded-xl border border-white/10 bg-midnight px-3 text-sm text-white outline-none placeholder:text-periwinkle/45"
        />
      </label>
    );
  }

  return (
    <button type="button" onClick={onStart} className={label === "Name" ? editablePillClass.replace("text-periwinkle/85", "text-ice") : editablePillClass}>
      {label}: {displayValue || placeholder || "Add"}
    </button>
  );
}

function EditableProfileSelect({
  value,
  active,
  onStart,
  onSave
}: {
  value: WellnessProfileId;
  active: boolean;
  onStart: () => void;
  onSave: (value: WellnessProfileId) => void;
}) {
  if (active) {
    return (
      <label className="inline-grid gap-1 rounded-2xl border border-ice/25 bg-midnight/70 px-3 py-2 text-xs text-ice shadow-ice">
        <span>Profile</span>
        <select
          autoFocus
          value={value}
          onChange={(event) => onSave(event.target.value as WellnessProfileId)}
          onBlur={() => onSave(value)}
          className="min-h-9 rounded-xl border border-white/10 bg-midnight px-3 text-sm text-white outline-none"
        >
          <option value="female">Female Wellness</option>
          <option value="male">Male Wellness</option>
          <option value="general">General Wellness</option>
          <option value="custom">Custom</option>
        </select>
      </label>
    );
  }

  return (
    <button type="button" onClick={onStart} className={editablePillClass}>
      Profile: {getProfileLabel(value)}
    </button>
  );
}

export function HomeDashboard({ tiles, selectedProfile, onOpenTile, onProfileChange }: HomeDashboardProps) {
  const [weightLogs, setWeightLogs] = useLocalStorage<WeightSummary[]>("ybw.weightLogs", []);
  const [userProfile, setUserProfile] = useLocalStorage("ybw.userProfile", emptyUserProfile);
  const [editingField, setEditingField] = useState<"name" | "age" | "height" | "weight" | "profile" | null>(null);
  const latestWeight = [...weightLogs].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const profileName = userProfile.preferredName || userProfile.displayName;
  const displayName = profileName || profileSummary.name;
  const displayWeight = userProfile.weight || (latestWeight ? `${latestWeight.weight} ${latestWeight.unit}` : "");
  const displayBmi = formatBmi(displayWeight, userProfile.height);
  const avatarEmoji = userProfile.avatarEmoji || "*";
  const showAvatarImage = userProfile.avatarType === "image" && Boolean(userProfile.avatarImage);
  const saveProfileField = (field: "preferredName" | "age" | "height" | "weight", value: string) => {
    const trimmed = value.trim();
    setUserProfile((current) => ({
      ...current,
      [field]: trimmed,
      displayName: field === "preferredName" && !current.displayName ? trimmed : current.displayName
    }));

    if (field === "weight" && trimmed) {
      const today = new Date().toISOString().slice(0, 10);
      const numericWeight = trimmed.match(/\d+(?:\.\d+)?/)?.[0] || trimmed;
      const unit: "lb" | "kg" = /\bkg\b/i.test(trimmed) ? "kg" : "lb";
      setWeightLogs((current) => {
        const existing = current.find((entry) => entry.date === today);
        if (existing) {
          return current.map((entry) => (entry.date === today ? { ...entry, weight: numericWeight, unit } : entry));
        }
        return [{ id: createId("weight"), date: today, weight: numericWeight, unit }, ...current];
      });
    }

    setEditingField(null);
  };

  return (
    <main className="grid min-w-0 gap-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-lavender backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ice/70">Your Blueprint Wellness</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white">
              {displayName === profileSummary.name ? "Private wellness blueprint" : `${displayName}'s wellness blueprint`}
            </h1>
            <p className="mt-2 text-sm leading-6 text-periwinkle/85">Mobile-first wellness tracking for yourblueprintwellness.com.</p>
          </div>
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-lavender/25 bg-lavender/15 text-2xl text-lavender shadow-lavender">
            {showAvatarImage ? (
              <img src={userProfile.avatarImage} alt="Profile avatar" className="h-full w-full object-cover" />
            ) : avatarEmoji ? (
              <span aria-hidden="true">{avatarEmoji}</span>
            ) : (
              <Sparkles size={23} aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-midnight/50 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-periwinkle/85">
            <EditableProfilePill
              label="Name"
              value={profileName}
              displayValue={displayName}
              placeholder={profileSummary.name}
              active={editingField === "name"}
              onStart={() => setEditingField("name")}
              onSave={(value) => saveProfileField("preferredName", value)}
            />
            <EditableProfilePill
              label="Age"
              value={userProfile.age}
              displayValue={userProfile.age || profileSummary.age}
              placeholder={profileSummary.age}
              active={editingField === "age"}
              onStart={() => setEditingField("age")}
              onSave={(value) => saveProfileField("age", value)}
            />
            <EditableProfilePill
              label="Height"
              value={userProfile.height}
              displayValue={userProfile.height || profileSummary.height}
              placeholder={profileSummary.height}
              active={editingField === "height"}
              onStart={() => setEditingField("height")}
              onSave={(value) => saveProfileField("height", value)}
            />
            <EditableProfilePill
              label="Weight"
              value={userProfile.weight}
              displayValue={displayWeight || "Add weight"}
              placeholder="Add weight"
              active={editingField === "weight"}
              onStart={() => setEditingField("weight")}
              onSave={(value) => saveProfileField("weight", value)}
            />
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">BMI: {displayBmi}</span>
            <EditableProfileSelect value={selectedProfile} active={editingField === "profile"} onStart={() => setEditingField("profile")} onSave={(value) => {
              onProfileChange(value);
              setEditingField(null);
            }} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender/75">Dashboard</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Choose an area</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-4">
          {tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} onOpen={onOpenTile} />
          ))}
        </div>
      </section>
    </main>
  );
}
