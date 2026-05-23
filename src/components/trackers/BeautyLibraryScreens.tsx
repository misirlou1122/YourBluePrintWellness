import { useState } from "react";
import { Camera, Plus, UploadCloud } from "lucide-react";
import { EntryActions } from "../EntryActions";
import { EmptyState } from "../EmptyState";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { CollapsibleSectionCard } from "../CollapsibleSectionCard";
import { ReportsPanel } from "../ReportsPanel";
import { SectionCard } from "../SectionCard";
import { uploadMedicalDocument } from "../../lib/medicalDocuments";
import { useLocalCollection, useLocalStorage } from "../../lib/useLocalStorage";

interface BeautyEntry {
  id: string;
  title: string;
  category: string;
  details: string;
  notes: string;
}

interface RecipeEntry {
  id: string;
  title: string;
  category: string;
  ingredients: string;
  directions: string;
  notes: string;
  tags: string;
}

interface DocumentEntry {
  id: string;
  title: string;
  category: string;
  date: string;
  fileName: string;
  filePath?: string;
  notes: string;
}

interface PhotoEntry {
  id: string;
  category: string;
  date: string;
  fileName: string;
  filePath?: string;
  notes: string;
}

const recipeCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Smoothies",
  "Meal prep",
  "High protein",
  "Diabetic-friendly",
  "Heart healthy",
  "High fiber",
  "Period support foods",
  "Saved recipes",
  "Recipes to try"
];

const recipeTagOptions = ["High protein", "Diabetic-friendly", "Heart healthy", "High fiber", "Period support"];

const emptyBeauty: Omit<BeautyEntry, "id"> = { title: "", category: "Current products", details: "", notes: "" };
const emptyHair: Omit<BeautyEntry, "id"> = { title: "", category: "Products used", details: "", notes: "" };
const emptyRecipe: Omit<RecipeEntry, "id"> = { title: "", category: recipeCategories[0], ingredients: "", directions: "", notes: "", tags: "" };
const emptyDocument: Omit<DocumentEntry, "id"> = { title: "", category: "Lab documents", date: "", fileName: "", notes: "" };
const emptyPhoto: Omit<PhotoEntry, "id"> = { category: "Body", date: "", fileName: "", notes: "" };

function useEditable<T extends { id: string }, D extends Omit<T, "id">>(key: string, draftKey: string, emptyDraft: D, prefix: string) {
  const collection = useLocalCollection<T>(key, [], prefix);
  const [draft, setDraft] = useLocalStorage<D>(draftKey, emptyDraft);
  const [editingId, setEditingId] = useLocalStorage<string | null>(`${draftKey}.editingId`, null);
  const reset = () => {
    setDraft(emptyDraft);
    setEditingId(null);
  };
  const save = (isValid: (draft: D) => boolean, normalize?: (draft: D) => D) => {
    if (!isValid(draft)) return;
    const next = normalize ? normalize(draft) : draft;
    if (editingId) collection.update(editingId, next as unknown as Partial<T>);
    else collection.add(next as Omit<T, "id">);
    reset();
  };
  const startEdit = (entry: T) => {
    const { id: _id, ...rest } = entry;
    setDraft(rest as D);
    setEditingId(entry.id);
  };
  return { ...collection, draft, setDraft, editingId, reset, save, startEdit };
}

function BeautyList({
  entries,
  onEdit,
  onDelete,
  emptyTitle,
  emptyMessage
}: {
  entries: BeautyEntry[];
  onEdit: (entry: BeautyEntry) => void;
  onDelete: (id: string) => void;
  emptyTitle: string;
  emptyMessage: string;
}) {
  return entries.length ? (
    <SectionCard title="Saved entries">
      <div className="grid gap-3">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{entry.title}</h3>
                <p className="mt-1 text-xs text-lavender/80">{entry.category}</p>
              </div>
              <EntryActions onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry.id)} />
            </div>
            {entry.details ? <p className="mt-3 text-sm leading-6 text-periwinkle/85">{entry.details}</p> : null}
            {entry.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/80">{entry.notes}</p> : null}
          </article>
        ))}
      </div>
    </SectionCard>
  ) : (
    <EmptyState title={emptyTitle} message={emptyMessage} />
  );
}

export function SkinScreen() {
  const store = useEditable<BeautyEntry, Omit<BeautyEntry, "id">>("ybw.skinProducts", "ybw.skinDraft", emptyBeauty, "skin");
  const setField = (field: keyof typeof emptyBeauty, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));
  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.skin.formOpen" forceOpen={Boolean(store.editingId)} title="Skin & Beauty entry" sectionLabel="Current products">
        <div className="grid gap-3">
          <FormField label="Title" value={store.draft.title} onChange={(value) => setField("title", value)} />
          <SelectField label="Category" options={["AM routine", "PM routine", "Current products", "Products to try", "Irritation/breakout log"]} value={store.draft.category} onChange={(value) => setField("category", value)} />
          <TextAreaField label="Details" value={store.draft.details} onChange={(value) => setField("details", value)} />
          <TextAreaField label="Notes" value={store.draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Boolean(draft.title.trim() || draft.details.trim()))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add skin entry"}
        </button>
      </CollapsibleSectionCard>
      <BeautyList entries={store.items} onEdit={store.startEdit} onDelete={store.remove} emptyTitle="No skin entries yet" emptyMessage="Add your first routine, product, or skin note." />
    </div>
  );
}

export function HairScreen() {
  const store = useEditable<BeautyEntry, Omit<BeautyEntry, "id">>("ybw.hairProducts", "ybw.hairDraft", emptyHair, "hair");
  const setField = (field: keyof typeof emptyHair, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));
  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.hair.formOpen" forceOpen={Boolean(store.editingId)} title="Hair care entry" sectionLabel="Products used">
        <div className="grid gap-3">
          <FormField label="Title" value={store.draft.title} onChange={(value) => setField("title", value)} />
          <SelectField label="Category" options={["Wash day", "Refresh day", "Products used", "Curl routine", "Scalp notes"]} value={store.draft.category} onChange={(value) => setField("category", value)} />
          <TextAreaField label="Details" value={store.draft.details} onChange={(value) => setField("details", value)} />
          <TextAreaField label="Notes" value={store.draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Boolean(draft.title.trim() || draft.details.trim()))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add hair entry"}
        </button>
      </CollapsibleSectionCard>
      <BeautyList entries={store.items} onEdit={store.startEdit} onDelete={store.remove} emptyTitle="No hair entries yet" emptyMessage="Add your first wash day, product, or scalp note." />
    </div>
  );
}

export function RecipesScreen() {
  const store = useEditable<RecipeEntry, Omit<RecipeEntry, "id">>("ybw.recipes", "ybw.recipeDraft", emptyRecipe, "recipe");
  const [mealLogs, setMealLogs] = useLocalStorage<string[]>("ybw.loggedMeals", []);
  const setField = (field: keyof typeof emptyRecipe, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));
  return (
    <div className="grid gap-4">
      <CollapsibleSectionCard storageKey="ybw.recipes.formOpen" forceOpen={Boolean(store.editingId)} title="Recipe form" sectionLabel="Saved recipes">
        <div className="grid gap-3">
          <FormField label="Title" value={store.draft.title} onChange={(value) => setField("title", value)} />
          <SelectField label="Category" options={recipeCategories} value={store.draft.category} onChange={(value) => setField("category", value)} />
          <TextAreaField label="Ingredients" value={store.draft.ingredients} onChange={(value) => setField("ingredients", value)} />
          <TextAreaField label="Directions" value={store.draft.directions} onChange={(value) => setField("directions", value)} />
          <TextAreaField label="Notes" value={store.draft.notes} onChange={(value) => setField("notes", value)} />
          <SelectField label="Tag" options={recipeTagOptions} value={store.draft.tags} onChange={(value) => setField("tags", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Boolean(draft.title.trim()))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add recipe"}
        </button>
      </CollapsibleSectionCard>
      {store.items.length ? (
        <SectionCard title="Recipes">
          <div className="grid gap-3">
            {store.items.map((recipe) => (
              <article key={recipe.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{recipe.title}</h3>
                    <p className="mt-1 text-xs text-lavender/80">{recipe.category}{recipe.tags ? ` | ${recipe.tags}` : ""}</p>
                  </div>
                  <EntryActions onEdit={() => store.startEdit(recipe)} onDelete={() => store.remove(recipe.id)} />
                </div>
                {recipe.ingredients ? <p className="mt-3 text-sm leading-6 text-periwinkle/85">Ingredients: {recipe.ingredients}</p> : null}
                {recipe.directions ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">Directions: {recipe.directions}</p> : null}
                {recipe.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/80">{recipe.notes}</p> : null}
                <button type="button" onClick={() => setMealLogs([`${recipe.title} logged ${new Date().toLocaleString()}`, ...mealLogs])} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-lavender/25 bg-lavender/10 px-3 text-sm font-semibold text-lavender">
                  Log this meal
                </button>
              </article>
            ))}
          </div>
        </SectionCard>
      ) : <EmptyState title="No recipes yet" message="Add your first recipe." />}
      {mealLogs.length ? (
        <SectionCard title="Logged meals">
          <div className="grid gap-2">
            {mealLogs.map((meal, index) => <div key={`${meal}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm text-white">{meal}</div>)}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export function DocumentsScreen() {
  const store = useEditable<DocumentEntry, Omit<DocumentEntry, "id">>("ybw.documents", "ybw.documentDraft", emptyDocument, "doc");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const setField = (field: keyof typeof emptyDocument, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));

  const savePrivateFile = async () => {
    if (!selectedFile) {
      setUploadStatus("Choose a file first.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Saving file...");

    try {
      const uploaded = await uploadMedicalDocument(selectedFile, store.draft.category, store.draft.title || selectedFile.name);
      store.add({
        title: store.draft.title || uploaded.title,
        category: store.draft.category,
        date: store.draft.date || new Date().toISOString().slice(0, 10),
        fileName: uploaded.file_name,
        filePath: uploaded.file_path,
        notes: store.draft.notes
      });
      setSelectedFile(null);
      setUploadStatus("File saved privately to your account.");
    } catch (error) {
      setUploadStatus(error instanceof Error ? `${error.message} If this is a phone photo, try saving it as JPG or PDF and upload again.` : "File storage is not ready yet.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Save document" description="Add lab reports, doctor documents, or notes to your private wellness account.">
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm text-periwinkle/85">
            <span>PDF or photo</span>
            <input
              type="file"
              accept=".pdf,application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null);
                setUploadStatus("");
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-midnight/55 px-4 py-3 text-sm text-white file:mr-3 file:rounded-xl file:border-0 file:bg-lavender/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-lavender"
            />
          </label>
          {selectedFile ? <p className="text-sm text-ice">{selectedFile.name}</p> : null}
          <button type="button" onClick={savePrivateFile} disabled={isUploading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice disabled:opacity-60">
            <UploadCloud size={18} aria-hidden="true" />
            Save file privately
          </button>
          {uploadStatus ? <p className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm leading-6 text-white">{uploadStatus}</p> : null}
        </div>
      </SectionCard>
      <CollapsibleSectionCard storageKey="ybw.documents.formOpen" forceOpen={Boolean(store.editingId)} title="Document note" sectionLabel="Notes/documents">
        <div className="grid gap-3">
          <FormField label="Title" value={store.draft.title} onChange={(value) => setField("title", value)} />
          <SelectField label="Category" options={["Lab documents", "Doctor documents", "Exported reports", "Progress photos", "Notes/documents"]} value={store.draft.category} onChange={(value) => setField("category", value)} />
          <FormField label="Date" type="date" value={store.draft.date} onChange={(value) => setField("date", value)} />
          <FormField label="File name" value={store.draft.fileName} onChange={(value) => setField("fileName", value)} />
          <TextAreaField label="Notes" value={store.draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Boolean(draft.title.trim() || draft.fileName.trim()), (draft) => ({ ...draft, date: draft.date || new Date().toISOString().slice(0, 10) }))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add document note"}
        </button>
      </CollapsibleSectionCard>
      <DocumentList items={store.items} onEdit={store.startEdit} onDelete={store.remove} emptyTitle="No documents yet" emptyMessage="Add your first document note." />
      <ReportsPanel />
    </div>
  );
}

function DocumentList({ items, onEdit, onDelete, emptyTitle, emptyMessage }: { items: DocumentEntry[]; onEdit: (entry: DocumentEntry) => void; onDelete: (id: string) => void; emptyTitle: string; emptyMessage: string }) {
  return items.length ? (
    <SectionCard title="Documents">
      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-lavender/80">{item.category} | {item.date}</p>
              </div>
              <EntryActions onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
            </div>
            {item.fileName ? <p className="mt-3 text-sm text-ice">{item.fileName}</p> : null}
            {item.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{item.notes}</p> : null}
          </article>
        ))}
      </div>
    </SectionCard>
  ) : <EmptyState title={emptyTitle} message={emptyMessage} />;
}

export function ProgressPhotosScreen() {
  const store = useEditable<PhotoEntry, Omit<PhotoEntry, "id">>("ybw.progressPhotos", "ybw.photoDraft", emptyPhoto, "photo");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const setField = (field: keyof typeof emptyPhoto, value: string) => store.setDraft((current) => ({ ...current, [field]: value }));

  const savePrivatePhoto = async () => {
    if (!selectedFile) {
      setUploadStatus("Choose a photo first.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Saving photo...");

    try {
      const uploaded = await uploadMedicalDocument(selectedFile, "Progress photos", `${store.draft.category} progress photo`);
      store.add({
        category: store.draft.category,
        date: store.draft.date || new Date().toISOString().slice(0, 10),
        fileName: uploaded.file_name,
        filePath: uploaded.file_path,
        notes: store.draft.notes
      });
      setSelectedFile(null);
      setUploadStatus("Photo saved privately to your account.");
    } catch (error) {
      setUploadStatus(error instanceof Error ? `${error.message} If this is a phone photo, try saving it as JPG and upload again.` : "Photo storage is not ready yet.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Save progress photo" description="Save a private body, face, skin, or hair progress photo with notes.">
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm text-periwinkle/85">
            <span>Photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null);
                setUploadStatus("");
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-midnight/55 px-4 py-3 text-sm text-white file:mr-3 file:rounded-xl file:border-0 file:bg-lavender/20 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-lavender"
            />
          </label>
          {selectedFile ? <p className="text-sm text-ice">{selectedFile.name}</p> : null}
          <button type="button" onClick={savePrivatePhoto} disabled={isUploading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-ice/25 bg-ice/10 px-4 text-sm font-semibold text-ice shadow-ice disabled:opacity-60">
            <Camera size={18} aria-hidden="true" />
            Save photo privately
          </button>
          {uploadStatus ? <p className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm leading-6 text-white">{uploadStatus}</p> : null}
        </div>
      </SectionCard>
      <CollapsibleSectionCard storageKey="ybw.photos.formOpen" forceOpen={Boolean(store.editingId)} title="Progress photo note" sectionLabel="Progress photos">
        <div className="grid gap-3">
          <SelectField label="Category" options={["Body", "Face", "Skin", "Hair"]} value={store.draft.category} onChange={(value) => setField("category", value)} />
          <FormField label="Date" type="date" value={store.draft.date} onChange={(value) => setField("date", value)} />
          <FormField label="File name" value={store.draft.fileName} onChange={(value) => setField("fileName", value)} />
          <TextAreaField label="Notes" value={store.draft.notes} onChange={(value) => setField("notes", value)} />
        </div>
        <button type="button" onClick={() => store.save((draft) => Boolean(draft.notes.trim() || draft.fileName.trim()), (draft) => ({ ...draft, date: draft.date || new Date().toISOString().slice(0, 10) }))} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow">
          <Plus size={18} aria-hidden="true" />
          {store.editingId ? "Save changes" : "Add photo note"}
        </button>
      </CollapsibleSectionCard>
      {store.items.length ? (
        <SectionCard title="Progress photo notes">
          <div className="grid gap-3">
            {store.items.map((photo) => (
              <article key={photo.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{photo.category}</h3>
                    <p className="mt-1 text-xs text-lavender/80">{photo.date}</p>
                  </div>
                  <EntryActions onEdit={() => store.startEdit(photo)} onDelete={() => store.remove(photo.id)} />
                </div>
                {photo.fileName ? <p className="mt-3 text-sm text-ice">{photo.fileName}</p> : null}
                {photo.notes ? <p className="mt-2 text-sm leading-6 text-periwinkle/85">{photo.notes}</p> : null}
              </article>
            ))}
          </div>
        </SectionCard>
      ) : <EmptyState title="No progress photo notes yet" message="Add your first progress photo note." />}
    </div>
  );
}
