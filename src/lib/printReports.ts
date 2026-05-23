type StoredValue = unknown;

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const userId = window.localStorage.getItem("ybw.currentUserId");
  const keys = userId ? [`ybw.users.${userId}.${key}`, key] : [key];

  for (const storageKey of keys) {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored) as T;
    } catch {
      // Ignore malformed local records and keep looking for a usable value.
    }
  }

  return fallback;
}

function escapeHtml(value: StoredValue) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: StoredValue) {
  return value ? `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>` : "";
}

function empty(message: string) {
  return `<p class="empty">${escapeHtml(message)}</p>`;
}

function table(rows: string) {
  return rows ? `<table>${rows}</table>` : "";
}

interface LabEntry {
  category: string;
  labName: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  notes: string;
}

interface MedicationEntry {
  name: string;
  type: string;
  dose: string;
  timeOfDay: string;
  sideEffects: string;
  refillReminderDate: string;
}

interface AppointmentItem {
  text: string;
  completed?: boolean;
}

interface DoctorAppointment {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  phone: string;
  reason: string;
  notes: string;
  afterNotes: string;
  thingsToDiscuss: AppointmentItem[];
  questions: AppointmentItem[];
  followUpTasks: AppointmentItem[];
}

interface BodyMeasurementEntry {
  date: string;
  weight: string;
  height: string;
  bustChest: string;
  waist: string;
  hips: string;
  inseam: string;
  shoeSize: string;
  braSize: string;
  notes: string;
}

interface ShoppingReference {
  topsSizeNotes: string;
  bottomsSizeNotes: string;
  dressSizeNotes: string;
  braSizeNotes: string;
  shoeSizeNotes: string;
  favoriteFitNotes: string;
  brandsFitWell: string;
  brandsRunSmall: string;
  brandsRunLarge: string;
  onlineShoppingNotes: string;
}

export type PrintReportType = "wellness" | "labs" | "appointments" | "medications" | "measurements";

const titles: Record<PrintReportType, string> = {
  wellness: "Wellness Summary",
  labs: "Lab Summary",
  appointments: "Doctor Appointment Summary",
  medications: "Medication List",
  measurements: "Body Measurements / Shopping Reference"
};

export function printFocusedReport(type: PrintReportType) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!printWindow) {
    window.alert("Please allow pop-ups to print this report.");
    return;
  }

  printWindow.document.write(buildPrintDocument(type));
  printWindow.document.close();
  printWindow.focus();

  window.setTimeout(() => {
    printWindow.print();
  }, 250);
}

function buildPrintDocument(type: PrintReportType) {
  const printedDate = new Date().toLocaleDateString();
  const body = getReportBody(type);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Blueprint Wellness - ${escapeHtml(titles[type])}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff; color: #111827; font-family: Arial, sans-serif; line-height: 1.45; }
    main { max-width: 760px; margin: 0 auto; padding: 32px 28px; }
    header { border-bottom: 1px solid #d1d5db; margin-bottom: 22px; padding-bottom: 14px; }
    h1 { margin: 4px 0 6px; font-size: 28px; }
    h2 { border-bottom: 1px solid #e5e7eb; font-size: 18px; margin: 24px 0 10px; padding-bottom: 6px; }
    p { margin: 6px 0; }
    .meta, .empty, footer { color: #4b5563; font-size: 12px; }
    table { border-collapse: collapse; margin: 10px 0 18px; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; width: 32%; }
    ul { margin: 8px 0 18px; padding-left: 22px; }
    li { margin: 4px 0; }
    footer { border-top: 1px solid #d1d5db; margin-top: 28px; padding-top: 12px; }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="meta">Your Blueprint Wellness</p>
      <h1>${escapeHtml(titles[type])}</h1>
      <p class="meta">Date printed: ${escapeHtml(printedDate)}</p>
    </header>
    ${body}
    <footer>This app is for personal tracking and organization only. It does not diagnose, treat, or replace medical advice. Always consult a licensed medical professional.</footer>
  </main>
</body>
</html>`;
}

function getReportBody(type: PrintReportType) {
  if (type === "labs") return labsReport();
  if (type === "appointments") return appointmentsReport();
  if (type === "medications") return medicationsReport();
  if (type === "measurements") return measurementsReport();
  return wellnessReport();
}

function wellnessReport() {
  const profile = readStorage<Record<string, string>>("ybw.userProfile", {});
  const daily = readStorage<Record<string, Record<string, string | number>>>("ybw.dailyTrackers", {});
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = daily[today] ?? {};

  return `
    <h2>Profile</h2>
    ${table([
      row("Name", profile.preferredName || profile.displayName),
      row("Age", profile.age),
      row("Height", profile.height),
      row("Weight", profile.weight),
      row("Wellness profile", readStorage("ybw.wellnessProfile", ""))
    ].join("")) || empty("No profile details saved yet.")}
    <h2>Today</h2>
    ${table([
      row("Water", todayEntry.water ? `${todayEntry.water} oz` : ""),
      row("Protein", todayEntry.protein ? `${todayEntry.protein} g` : ""),
      row("Fiber", todayEntry.fiber ? `${todayEntry.fiber} g` : ""),
      row("Mood", todayEntry.mood),
      row("Medication status", todayEntry.medicationStatus),
      row("Workout status", todayEntry.workoutStatus),
      row("Food notes", todayEntry.foodNotes),
      row("Alcohol", todayEntry.alcohol)
    ].join("")) || empty("No daily tracker values saved for today.")}`;
}

function labsReport() {
  const labs = readStorage<LabEntry[]>("ybw.labs", []);
  if (!labs.length) return empty("No lab results saved yet.");

  return labs
    .map((lab) => `
      <h2>${escapeHtml(lab.category || "Lab result")}</h2>
      ${table([
        row("Lab name", lab.labName),
        row("Value", `${lab.value ?? ""} ${lab.unit ?? ""}`.trim()),
        row("Reference range", lab.referenceRange),
        row("Date", lab.date),
        row("Notes", lab.notes)
      ].join(""))}
    `)
    .join("");
}

function medicationsReport() {
  const medications = readStorage<MedicationEntry[]>("ybw.medications", []);
  if (!medications.length) return empty("No medications or supplements saved yet.");

  return medications
    .map((medication) => `
      <h2>${escapeHtml(medication.name || "Medication / supplement")}</h2>
      ${table([
        row("Type", medication.type),
        row("Dose", medication.dose),
        row("Time of day", medication.timeOfDay),
        row("Refill reminder", medication.refillReminderDate),
        row("Side effects notes", medication.sideEffects)
      ].join(""))}
    `)
    .join("");
}

function appointmentsReport() {
  const appointments = readStorage<DoctorAppointment[]>("ybw.appointments", []);
  if (!appointments.length) return empty("No doctor appointments saved yet.");

  return appointments
    .map((appointment) => `
      <h2>${escapeHtml(appointment.doctor || "Doctor appointment")}</h2>
      ${table([
        row("Specialty", appointment.specialty),
        row("Date/time", `${appointment.date ?? ""} ${appointment.time ?? ""}`.trim()),
        row("Location", appointment.location),
        row("Phone", appointment.phone),
        row("Reason", appointment.reason),
        row("Notes", appointment.notes),
        row("After appointment notes", appointment.afterNotes)
      ].join(""))}
      ${list("Things to discuss", appointment.thingsToDiscuss)}
      ${list("Questions for doctor", appointment.questions)}
      ${list("Follow-up tasks", appointment.followUpTasks)}
    `)
    .join("");
}

function measurementsReport() {
  const measurements = readStorage<BodyMeasurementEntry[]>("ybw.bodyMeasurements", []);
  const shopping = readStorage<ShoppingReference>("ybw.shoppingReference", {} as ShoppingReference);
  const latest = [...measurements].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];

  return `
    <h2>Latest Measurements</h2>
    ${
      latest
        ? table([
            row("Date", latest.date),
            row("Weight", latest.weight),
            row("Height", latest.height),
            row("Bust/chest", latest.bustChest),
            row("Waist", latest.waist),
            row("Hips", latest.hips),
            row("Inseam", latest.inseam),
            row("Shoe size", latest.shoeSize),
            row("Bra size", latest.braSize),
            row("Notes", latest.notes)
          ].join(""))
        : empty("No body measurements saved yet.")
    }
    <h2>Shopping Reference</h2>
    ${table([
      row("Tops size notes", shopping.topsSizeNotes),
      row("Bottoms size notes", shopping.bottomsSizeNotes),
      row("Dress size notes", shopping.dressSizeNotes),
      row("Bra size notes", shopping.braSizeNotes),
      row("Shoe size notes", shopping.shoeSizeNotes),
      row("Favorite fit notes", shopping.favoriteFitNotes),
      row("Brands that fit well", shopping.brandsFitWell),
      row("Brands that run small", shopping.brandsRunSmall),
      row("Brands that run large", shopping.brandsRunLarge),
      row("Online shopping notes", shopping.onlineShoppingNotes)
    ].join("")) || empty("No shopping reference notes saved yet.")}`;
}

function list(title: string, items: AppointmentItem[] = []) {
  if (!items.length) return "";
  return `<h2>${escapeHtml(title)}</h2><ul>${items.map((item) => `<li>${item.completed ? "[x] " : ""}${escapeHtml(item.text)}</li>`).join("")}</ul>`;
}
