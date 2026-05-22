import { useState } from "react";
import { Camera, Plus, UploadCloud } from "lucide-react";
import {
  documents as sampleDocuments,
  hairProducts,
  haircareRoutine,
  progressPhotos as sampleProgressPhotos,
  recipeCards,
  recipeCategories,
  skincareProducts,
  skincareRoutines,
  type DocumentSample,
  type ProductNote,
  type ProgressPhotoSample,
  type RecipeCard
} from "../../data/sampleData";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { Checklist } from "../Checklist";
import { EmptyState } from "../EmptyState";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { SectionCard } from "../SectionCard";

export function SkinScreen() {
  const [products, setProducts] = useLocalStorage<ProductNote[]>("ybw.skinProducts", skincareProducts);
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState("Current product");
  const [reaction, setReaction] = useState("");

  const addSkinNote = () => {
    if (!product.trim() && !reaction.trim()) {
      return;
    }

    setProducts([
      {
        name: product || "Skin note",
        status,
        notes: reaction || "No irritation note."
      },
      ...products
    ]);
    setProduct("");
    setStatus("Current product");
    setReaction("");
  };

  return (
    <div className="grid gap-4">
      {skincareRoutines.map((routine) => (
        <SectionCard key={routine.title} title={routine.title} description="Routine checklist state persists locally.">
          <Checklist items={routine.steps} checkedFirst={false} storageKey={`ybw.skinRoutine.${routine.title}`} />
        </SectionCard>
      ))}

      <SectionCard title="Products and skin notes" description="Current products, products to try, and reaction notes save locally.">
        <div className="grid gap-3">
          {products.map((item, index) => (
            <article key={`${item.name}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <h3 className="text-sm font-semibold text-white">{item.name}</h3>
              <p className="mt-1 text-xs text-lavender/80">{item.status}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{item.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Irritation / breakout log" description="Track product reactions gently and locally.">
        <div className="grid gap-3">
          <FormField label="Product" value={product} onChange={setProduct} />
          <SelectField label="Status" options={["Current product", "Product to try", "Irritation note", "Breakout note"]} value={status} onChange={setStatus} />
          <TextAreaField label="Irritation or breakout note" value={reaction} onChange={setReaction} />
        </div>
        <button
          type="button"
          onClick={addSkinNote}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save skin note
        </button>
      </SectionCard>
    </div>
  );
}

export function HairScreen() {
  const [products, setProducts] = useLocalStorage<ProductNote[]>("ybw.hairProducts", hairProducts);
  const [washDay, setWashDay] = useState("");
  const [refreshDay, setRefreshDay] = useState("");
  const [productsUsed, setProductsUsed] = useState("");
  const [curlRoutine, setCurlRoutine] = useState("");
  const [scalpNotes, setScalpNotes] = useState("");

  const addHairNote = () => {
    if (!productsUsed.trim() && !curlRoutine.trim() && !scalpNotes.trim()) {
      return;
    }

    setProducts([
      {
        name: productsUsed || "Hair care note",
        status: washDay ? `Wash day: ${washDay}` : refreshDay ? `Refresh day: ${refreshDay}` : "Hair note",
        notes: [curlRoutine, scalpNotes].filter(Boolean).join(" | ") || "Local hair care note."
      },
      ...products
    ]);
    setWashDay("");
    setRefreshDay("");
    setProductsUsed("");
    setCurlRoutine("");
    setScalpNotes("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard title={haircareRoutine.title} description="Wash day, refresh day, products, curl routine, and scalp notes.">
        <Checklist items={haircareRoutine.steps} checkedFirst={false} storageKey="ybw.hairRoutineChecklist" />
      </SectionCard>

      <SectionCard title="Hair notes" description="Products used, curl routine, and scalp notes save locally.">
        <div className="grid gap-3">
          {products.map((item, index) => (
            <article key={`${item.name}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <h3 className="text-sm font-semibold text-white">{item.name}</h3>
              <p className="mt-1 text-xs text-lavender/80">{item.status}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{item.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Hair care entry" description="A simple local form for hair notes.">
        <div className="grid gap-3">
          <FormField label="Wash day" type="date" value={washDay} onChange={setWashDay} />
          <FormField label="Refresh day" type="date" value={refreshDay} onChange={setRefreshDay} />
          <TextAreaField label="Products used" value={productsUsed} onChange={setProductsUsed} />
          <TextAreaField label="Curl routine" value={curlRoutine} onChange={setCurlRoutine} />
          <TextAreaField label="Scalp notes" value={scalpNotes} onChange={setScalpNotes} />
        </div>
        <button
          type="button"
          onClick={addHairNote}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save hair note
        </button>
      </SectionCard>
    </div>
  );
}

export function RecipesScreen() {
  const [recipes, setRecipes] = useLocalStorage<RecipeCard[]>("ybw.recipes", recipeCards);
  const [mealLogs, setMealLogs] = useLocalStorage<string[]>("ybw.loggedMeals", []);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(recipeCategories[0]);
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [protein, setProtein] = useState("");
  const [fiber, setFiber] = useState("");

  const addRecipe = () => {
    if (!title.trim()) {
      return;
    }

    setRecipes([
      {
        id: `rec-${Date.now()}`,
        title: title.trim(),
        category,
        protein: protein || "Estimate to add",
        fiber: fiber || "Estimate to add",
        notes: [ingredients, directions].filter(Boolean).join(" | ") || "Local recipe note."
      },
      ...recipes
    ]);
    setTitle("");
    setCategory(recipeCategories[0]);
    setIngredients("");
    setDirections("");
    setProtein("");
    setFiber("");
  };

  return (
    <div className="grid gap-4">
      <SectionCard title="Recipe categories" description="Tap-friendly category chips for organizing meals.">
        <div className="flex flex-wrap gap-2">
          {recipeCategories.map((item) => (
            <button key={item} type="button" className="min-h-10 rounded-full border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-periwinkle/85">
              {item}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recipe cards" description="Recipes and meal logs persist locally.">
        <div className="grid gap-3">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{recipe.title}</h3>
                <span className="rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-xs font-semibold text-ice">
                  {recipe.category}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{recipe.notes}</p>
              <p className="mt-2 text-xs text-lavender/80">
                Protein: {recipe.protein} | Fiber: {recipe.fiber}
              </p>
              <button
                type="button"
                onClick={() => setMealLogs([`${recipe.title} logged ${new Date().toLocaleString()}`, ...mealLogs])}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-lavender/25 bg-lavender/10 px-3 text-sm font-semibold text-lavender"
              >
                Log this meal
              </button>
            </article>
          ))}
        </div>
      </SectionCard>

      {mealLogs.length ? (
        <SectionCard title="Logged meals">
          <div className="grid gap-2">
            {mealLogs.map((meal, index) => (
              <div key={`${meal}-${index}`} className="rounded-2xl border border-white/10 bg-midnight/45 p-3 text-sm text-white">
                {meal}
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Recipe form" description="Recipe entries save locally in this browser.">
        <div className="grid gap-3">
          <FormField label="Recipe title" value={title} onChange={setTitle} />
          <SelectField label="Category" options={recipeCategories} value={category} onChange={setCategory} />
          <TextAreaField label="Ingredients" value={ingredients} onChange={setIngredients} />
          <TextAreaField label="Directions" value={directions} onChange={setDirections} />
          <FormField label="Protein estimate" value={protein} onChange={setProtein} />
          <FormField label="Fiber estimate" value={fiber} onChange={setFiber} />
        </div>
        <button
          type="button"
          onClick={addRecipe}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save recipe
        </button>
      </SectionCard>
    </div>
  );
}

export function DocumentsScreen() {
  const [documents, setDocuments] = useLocalStorage<DocumentSample[]>("ybw.documents", sampleDocuments);
  const [category, setCategory] = useState("Lab documents");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const addDocument = () => {
    if (!title.trim() && !notes.trim()) {
      return;
    }

    setDocuments([
      {
        id: `doc-${Date.now()}`,
        title: title || "Document note",
        category,
        date: new Date().toISOString().slice(0, 10),
        notes
      },
      ...documents
    ]);
    setTitle("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <EmptyState
        title="Upload PDF/photo"
        message="Document notes save locally for now. Files are not uploaded yet."
        icon={UploadCloud}
        actionLabel="Choose file"
      />

      <SectionCard title="Document note" description="Document category and notes persist locally.">
        <div className="grid gap-3">
          <SelectField
            label="Document category"
            options={["Lab documents", "Doctor documents", "Exported reports", "Progress photos", "Notes/documents"]}
            value={category}
            onChange={setCategory}
          />
          <FormField label="Document title" value={title} onChange={setTitle} />
          <TextAreaField label="Notes" value={notes} onChange={setNotes} />
        </div>
        <button
          type="button"
          onClick={addDocument}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save document note
        </button>
      </SectionCard>

      <SectionCard title="Sample documents" description="Sample records only. No real files are stored.">
        <div className="grid gap-3">
          {documents.map((document) => (
            <article key={document.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <h3 className="text-sm font-semibold text-white">{document.title}</h3>
              <p className="mt-1 text-xs text-lavender/80">
                {document.category} | {document.date}
              </p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{document.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function ProgressPhotosScreen() {
  const [photos, setPhotos] = useLocalStorage<ProgressPhotoSample[]>("ybw.progressPhotos", sampleProgressPhotos);
  const [category, setCategory] = useState("Body");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const addPhotoNote = () => {
    if (!notes.trim() && !date) {
      return;
    }

    setPhotos([
      {
        id: `photo-${Date.now()}`,
        category,
        date: date || new Date().toISOString().slice(0, 10),
        notes: notes || "Progress photo note."
      },
      ...photos
    ]);
    setCategory("Body");
    setDate("");
    setNotes("");
  };

  return (
    <div className="grid gap-4">
      <EmptyState
        title="Progress photo note"
        message="Body, face, skin, and hair notes save locally. Images are not uploaded yet."
        icon={Camera}
        actionLabel="Choose photo"
      />

      <SectionCard title="Photo categories" description="Private progress photo categories for a future secure upload flow.">
        <Checklist items={["Body", "Face", "Skin", "Hair"]} checkedFirst={false} storageKey="ybw.progressPhotoCategories" />
      </SectionCard>

      <SectionCard title="Add progress photo note" description="Date and notes persist locally.">
        <div className="grid gap-3">
          <SelectField label="Category" options={["Body", "Face", "Skin", "Hair"]} value={category} onChange={setCategory} />
          <FormField label="Date" type="date" value={date} onChange={setDate} />
          <TextAreaField label="Notes" value={notes} onChange={setNotes} />
        </div>
        <button
          type="button"
          onClick={addPhotoNote}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sapphire via-periwinkle to-lavender px-4 text-sm font-semibold text-white shadow-glow"
        >
          <Plus size={18} aria-hidden="true" />
          Save photo note
        </button>
      </SectionCard>

      <SectionCard title="Progress photo notes" description="Comparison notes without real images.">
        <div className="grid gap-3">
          {photos.map((photo) => (
            <article key={photo.id} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{photo.category}</h3>
                <span className="rounded-full border border-ice/20 bg-ice/10 px-2.5 py-1 text-xs font-semibold text-ice">
                  {photo.date}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{photo.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Comparison view" description="Future before/after comparisons can live here.">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-white/15 bg-midnight/45 text-sm text-periwinkle/70">
            Before
          </div>
          <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-white/15 bg-midnight/45 text-sm text-periwinkle/70">
            After
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
