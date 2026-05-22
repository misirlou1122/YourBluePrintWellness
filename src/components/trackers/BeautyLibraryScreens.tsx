import { Camera, UploadCloud } from "lucide-react";
import {
  documents,
  hairProducts,
  haircareRoutine,
  progressPhotos,
  recipeCards,
  recipeCategories,
  skincareProducts,
  skincareRoutines
} from "../../data/sampleData";
import { Checklist } from "../Checklist";
import { EmptyState } from "../EmptyState";
import { FormField, SelectField, TextAreaField } from "../FormField";
import { SectionCard } from "../SectionCard";

export function SkinScreen() {
  return (
    <div className="grid gap-4">
      {skincareRoutines.map((routine) => (
        <SectionCard key={routine.title} title={routine.title} description="Routine checklist placeholder.">
          <Checklist items={routine.steps} checkedFirst={false} />
        </SectionCard>
      ))}

      <SectionCard title="Products" description="Current products and products to try.">
        <div className="grid gap-3">
          {skincareProducts.map((product) => (
            <article key={product.name} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <h3 className="text-sm font-semibold text-white">{product.name}</h3>
              <p className="mt-1 text-xs text-lavender/80">{product.status}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{product.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Irritation / breakout log" description="Track product reactions gently.">
        <div className="grid gap-3">
          <FormField label="Product" />
          <SelectField label="AM or PM" options={["AM", "PM", "Both", "Not sure"]} />
          <TextAreaField label="Irritation or breakout note" />
        </div>
      </SectionCard>
    </div>
  );
}

export function HairScreen() {
  return (
    <div className="grid gap-4">
      <SectionCard title={haircareRoutine.title} description="Wash day, refresh day, products, curl routine, and scalp notes.">
        <Checklist items={haircareRoutine.steps} checkedFirst={false} />
      </SectionCard>

      <SectionCard title="Products used" description="Current products and products to try.">
        <div className="grid gap-3">
          {hairProducts.map((product) => (
            <article key={product.name} className="rounded-2xl border border-white/10 bg-midnight/45 p-4">
              <h3 className="text-sm font-semibold text-white">{product.name}</h3>
              <p className="mt-1 text-xs text-lavender/80">{product.status}</p>
              <p className="mt-2 text-sm leading-6 text-periwinkle/85">{product.notes}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Hair care entry" description="A simple local placeholder form.">
        <div className="grid gap-3">
          <FormField label="Wash day" type="date" />
          <FormField label="Refresh day" type="date" />
          <TextAreaField label="Products used" />
          <TextAreaField label="Curl routine" />
          <TextAreaField label="Scalp notes" />
        </div>
      </SectionCard>
    </div>
  );
}

export function RecipesScreen() {
  return (
    <div className="grid gap-4">
      <SectionCard title="Recipe categories" description="Tap-friendly category chips for organizing meals.">
        <div className="flex flex-wrap gap-2">
          {recipeCategories.map((category) => (
            <button key={category} type="button" className="min-h-10 rounded-full border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-periwinkle/85">
              {category}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recipe cards" description="Sample cards with protein/fiber estimates and meal logging placeholders.">
        <div className="grid gap-3">
          {recipeCards.map((recipe) => (
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
              <button type="button" className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-lavender/25 bg-lavender/10 px-3 text-sm font-semibold text-lavender">
                Log this meal
              </button>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recipe placeholder form" description="Future recipe entries can include ingredients and directions.">
        <div className="grid gap-3">
          <FormField label="Recipe title" />
          <SelectField label="Category" options={recipeCategories} />
          <TextAreaField label="Ingredients" />
          <TextAreaField label="Directions" />
          <FormField label="Protein estimate" />
          <FormField label="Fiber estimate" />
        </div>
      </SectionCard>
    </div>
  );
}

export function DocumentsScreen() {
  return (
    <div className="grid gap-4">
      <EmptyState
        title="Upload PDF/photo placeholder"
        message="No real storage is connected yet. This is a safe UI placeholder for future secure uploads."
        icon={UploadCloud}
        actionLabel="Choose file later"
      />

      <SectionCard title="Document category" description="Select where a future document would belong.">
        <SelectField
          label="Document category"
          options={["Lab documents", "Doctor documents", "Exported reports", "Progress photos", "Notes/documents"]}
        />
      </SectionCard>

      <SectionCard title="Sample documents" description="Placeholder records only. No real files are stored.">
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
  return (
    <div className="grid gap-4">
      <EmptyState
        title="Progress photo placeholder"
        message="Body, face, skin, and hair photo flows are UI-only for now. No real images are uploaded or stored."
        icon={Camera}
        actionLabel="Choose photo later"
      />

      <SectionCard title="Photo categories" description="Private progress photo categories for a future secure upload flow.">
        <Checklist items={["Body", "Face", "Skin", "Hair"]} checkedFirst={false} />
      </SectionCard>

      <SectionCard title="Sample photo notes" description="Comparison placeholders without real images.">
        <div className="grid gap-3">
          {progressPhotos.map((photo) => (
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

      <SectionCard title="Comparison placeholder" description="Future before/after comparisons can live here.">
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
