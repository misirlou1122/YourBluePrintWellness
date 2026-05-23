export function parseHeightInInches(height: string) {
  const value = height.trim().toLowerCase();
  if (!value) return null;

  const feetInches = value.match(/(\d+(?:\.\d+)?)\s*(?:'|ft|feet)\s*(\d+(?:\.\d+)?)?/);
  if (feetInches) {
    const feet = Number.parseFloat(feetInches[1]);
    const inches = feetInches[2] ? Number.parseFloat(feetInches[2]) : 0;
    return feet * 12 + inches;
  }

  const centimeters = value.match(/(\d+(?:\.\d+)?)\s*cm/);
  if (centimeters) {
    return Number.parseFloat(centimeters[1]) / 2.54;
  }

  const plainNumber = Number.parseFloat(value);
  if (Number.isNaN(plainNumber)) return null;

  return plainNumber > 96 ? plainNumber / 2.54 : plainNumber;
}

export function parseWeightPounds(weight: string) {
  const value = weight.trim().toLowerCase();
  if (!value) return null;

  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return null;

  return value.includes("kg") ? numeric * 2.20462 : numeric;
}

export function calculateBmi(weight: string, height: string) {
  const pounds = parseWeightPounds(weight);
  const inches = parseHeightInInches(height);

  if (!pounds || !inches) return null;

  return Number(((pounds / (inches * inches)) * 703).toFixed(1));
}

export function formatBmi(weight: string, height: string) {
  const bmi = calculateBmi(weight, height);
  return bmi ? String(bmi) : "Add height and weight";
}
