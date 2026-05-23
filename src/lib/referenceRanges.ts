export interface ReferenceRangeItem {
  label: string;
  range: string;
  note?: string;
}

export const bloodPressureReferenceRanges: ReferenceRangeItem[] = [
  {
    label: "Normal adult range",
    range: "Systolic under 120 and diastolic under 80"
  },
  {
    label: "Elevated range",
    range: "Systolic 120-129 and diastolic under 80"
  },
  {
    label: "Higher range",
    range: "Systolic 130-139 or diastolic 80-89"
  },
  {
    label: "Very high range",
    range: "Systolic 140+ or diastolic 90+",
    note: "Use this as a reference prompt to follow up with your doctor."
  }
];

export const vitalsReferenceRanges: ReferenceRangeItem[] = [
  {
    label: "Blood pressure",
    range: "Normal adult reference is under 120/80 and above 90/60"
  },
  {
    label: "Resting heart rate",
    range: "Common adult reference is 60-100 bpm"
  },
  {
    label: "Oxygen saturation",
    range: "Common reference is 95%-100%"
  },
  {
    label: "Body temperature",
    range: "Common adult reference is about 97°F-99°F"
  }
];

export const bmiReferenceRanges: ReferenceRangeItem[] = [
  {
    label: "Underweight",
    range: "BMI under 18.5"
  },
  {
    label: "Healthy weight",
    range: "BMI 18.5 to under 25"
  },
  {
    label: "Overweight",
    range: "BMI 25 to under 30"
  },
  {
    label: "Obesity range",
    range: "BMI 30 or higher"
  }
];

export function parseBloodPressure(value: string) {
  const match = value.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if (!match) return null;

  return {
    systolic: Number.parseInt(match[1], 10),
    diastolic: Number.parseInt(match[2], 10)
  };
}

export function getBloodPressureReferenceLabel(value: string) {
  const reading = parseBloodPressure(value);
  if (!reading) return "";

  if (reading.diastolic > reading.systolic) {
    return "Check entry format";
  }

  if (reading.systolic >= 140 || reading.diastolic >= 90) {
    return "Very high range";
  }

  if (reading.systolic >= 130 || reading.diastolic >= 80) {
    return "Higher range";
  }

  if (reading.systolic >= 120 && reading.diastolic < 80) {
    return "Elevated range";
  }

  if (reading.systolic < 120 && reading.diastolic < 80 && reading.systolic > 90 && reading.diastolic > 60) {
    return "Normal adult range";
  }

  return "Outside common reference range";
}

export function getBmiReferenceLabel(bmi: number | string | null) {
  const value = typeof bmi === "number" ? bmi : Number.parseFloat(String(bmi ?? ""));
  if (Number.isNaN(value)) return "";

  if (value < 18.5) return "Underweight";
  if (value < 25) return "Healthy weight";
  if (value < 30) return "Overweight";
  return "Obesity range";
}
