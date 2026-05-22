# Your Blueprint Wellness

Your Blueprint Wellness is a mobile-first personal wellness web app foundation for `yourblueprintwellness.com`.

The first version is intentionally a safe, local-only React/TypeScript/Tailwind PWA foundation with sample data, placeholder UI, and no real health data, secrets, storage, OCR, authentication, or medical recommendations.

## Local Project Location

This project should live on the D: drive:

```powershell
D:\yourblueprintwellness
```

GitHub repository:

```text
https://github.com/misirlou1122/yourblueprintwellness.git
```

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Mobile-first responsive layout
- PWA-friendly manifest and service worker
- Azure Static Web Apps-ready config

## Run Locally

From PowerShell:

```powershell
cd D:\yourblueprintwellness
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Build for production:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Current Version Includes

- Mobile-first home dashboard
- Luxury midnight navy, sapphire, icy blue, periwinkle, and lavender glow design
- Profile and Daily Snapshot sample cards
- Large thumb-friendly tiles for all requested wellness areas
- Tile to subcategory to detail-entry structure
- Return Home and Previous / Next tile navigation
- Placeholder login/private dashboard panel
- Lab PDF upload placeholder
- Manual entry placeholders
- Sample A1C, cholesterol, and glucose trend cards
- Doctor appointment details with Things To Discuss checklist
- Medication and supplement tracking placeholders
- Vitals, fitness, food, alcohol, period, mood, skin, hair, recipes, documents, reminders, and progress photo placeholders
- Quick Notes / Brain Dump with local keyword-based category suggestions
- Reports / PDF export placeholder buttons
- Medical safety disclaimer
- PWA manifest and service worker foundation

## Future Azure Architecture

Frontend:

- Azure Static Web Apps

Backend:

- Azure Functions

Database:

- Azure SQL Database

File Storage:

- Azure Blob Storage

PDF/Lab Extraction:

- Azure AI Document Intelligence

AI Summaries:

- Azure OpenAI

Secrets:

- Azure Key Vault

Monitoring:

- Application Insights

Domain:

- Namecheap custom domain connected to Azure Static Web Apps

## Future Features

- Real authentication and protected routes
- Secure user profile storage
- Azure SQL-backed wellness entries
- Secure PDF and image uploads
- Lab PDF extraction from Quest, MyChart, and doctor portal documents
- Human-reviewed lab value import into the right subcategories
- Doctor summary PDF exports
- Appointment exports and visit preparation summaries
- Medication refill and reminder notifications
- Progress photo comparison tools
- Azure OpenAI-powered note categorization and wellness summaries
- User settings, accessibility improvements, and data export/delete controls

## Privacy And Security Notes

- Do not commit real API keys, secrets, tokens, or private health data.
- Do not store private medical uploads in the public frontend.
- Future uploads should go through authenticated Azure Functions and private Azure Blob Storage containers.
- Future secrets should live in Azure Key Vault.
- Future production telemetry should avoid logging private health content.
- `.env.example` is safe as a template only. Real `.env` files are ignored by Git.

## Medical Disclaimer

This app is for personal tracking and organization only. It does not diagnose, treat, or replace medical advice. Always consult a licensed medical professional.
