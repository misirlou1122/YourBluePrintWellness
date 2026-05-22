import { Check, Pencil, Trash2, X } from "lucide-react";

interface EntryActionsProps {
  isEditing?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
}

export function EntryActions({ isEditing = false, onEdit, onDelete, onCancel, onSave }: EntryActionsProps) {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-3 text-xs font-semibold text-ice"
        >
          <Check size={15} aria-hidden="true" />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-periwinkle/85"
        >
          <X size={15} aria-hidden="true" />
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="grid min-h-10 min-w-10 place-items-center rounded-2xl border border-ice/20 bg-ice/10 text-ice"
        aria-label="Edit entry"
      >
        <Pencil size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="grid min-h-10 min-w-10 place-items-center rounded-2xl border border-lavender/20 bg-lavender/10 text-lavender"
        aria-label="Delete entry"
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
