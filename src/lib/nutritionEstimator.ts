export interface NutritionEstimate {
  input: string;
  matchedFoodName: string;
  quantityLabel: string;
  calories: number;
  protein: number;
  fiber: number;
}

interface FoodProfile {
  name: string;
  aliases: string[];
  servingUnit: string;
  calories: number;
  protein: number;
  fiber: number;
  unitMultipliers: Record<string, number>;
}

const quantityWords: Record<string, number> = {
  half: 0.5,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6
};

const unitAliases: Record<string, string> = {
  c: "cup",
  cup: "cup",
  cups: "cup",
  tbsp: "tablespoon",
  tablespoon: "tablespoon",
  tablespoons: "tablespoon",
  tsp: "teaspoon",
  teaspoon: "teaspoon",
  teaspoons: "teaspoon",
  oz: "ounce",
  ounce: "ounce",
  ounces: "ounce",
  g: "gram",
  gram: "gram",
  grams: "gram",
  egg: "egg",
  eggs: "egg",
  slice: "slice",
  slices: "slice",
  scoop: "scoop",
  scoops: "scoop",
  serving: "serving",
  servings: "serving",
  can: "can",
  cans: "can",
  piece: "piece",
  pieces: "piece",
  bar: "bar",
  bars: "bar",
  handful: "handful",
  handfuls: "handful"
};

const foods: FoodProfile[] = [
  {
    name: "Cottage cheese",
    aliases: ["cottage cheese"],
    servingUnit: "cup",
    calories: 180,
    protein: 26,
    fiber: 0,
    unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 226, ounce: 1 / 8 }
  },
  {
    name: "Greek yogurt",
    aliases: ["greek yogurt", "yogurt"],
    servingUnit: "cup",
    calories: 130,
    protein: 23,
    fiber: 0,
    unitMultipliers: { cup: 1, serving: 0.75, gram: 1 / 245, ounce: 1 / 8.6 }
  },
  {
    name: "Egg",
    aliases: ["egg", "eggs"],
    servingUnit: "egg",
    calories: 72,
    protein: 6,
    fiber: 0,
    unitMultipliers: { egg: 1, piece: 1, serving: 1 }
  },
  {
    name: "Chicken breast",
    aliases: ["chicken breast", "chicken"],
    servingUnit: "ounce",
    calories: 47,
    protein: 8.8,
    fiber: 0,
    unitMultipliers: { ounce: 1, gram: 1 / 28.35, serving: 3 }
  },
  {
    name: "Salmon",
    aliases: ["salmon"],
    servingUnit: "ounce",
    calories: 58,
    protein: 6.2,
    fiber: 0,
    unitMultipliers: { ounce: 1, gram: 1 / 28.35, serving: 3 }
  },
  {
    name: "Tuna",
    aliases: ["tuna"],
    servingUnit: "can",
    calories: 120,
    protein: 26,
    fiber: 0,
    unitMultipliers: { can: 1, serving: 1, ounce: 1 / 5, gram: 1 / 142 }
  },
  {
    name: "Tofu",
    aliases: ["tofu"],
    servingUnit: "cup",
    calories: 180,
    protein: 20,
    fiber: 2.8,
    unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 252, ounce: 1 / 8.9 }
  },
  {
    name: "Lentils",
    aliases: ["lentils", "lentil"],
    servingUnit: "cup",
    calories: 230,
    protein: 18,
    fiber: 15.6,
    unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 198, ounce: 1 / 7 }
  },
  {
    name: "Black beans",
    aliases: ["black beans", "beans"],
    servingUnit: "cup",
    calories: 227,
    protein: 15,
    fiber: 15,
    unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 172, ounce: 1 / 6.1 }
  },
  {
    name: "Oatmeal",
    aliases: ["oatmeal", "oats"],
    servingUnit: "cup",
    calories: 154,
    protein: 6,
    fiber: 4,
    unitMultipliers: { cup: 1, serving: 1, gram: 1 / 234, ounce: 1 / 8.3 }
  },
  {
    name: "Rice",
    aliases: ["rice", "white rice", "brown rice"],
    servingUnit: "cup",
    calories: 216,
    protein: 5,
    fiber: 3.5,
    unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 195, ounce: 1 / 6.9 }
  },
  {
    name: "Quinoa",
    aliases: ["quinoa"],
    servingUnit: "cup",
    calories: 222,
    protein: 8,
    fiber: 5,
    unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 185, ounce: 1 / 6.5 }
  },
  {
    name: "Avocado",
    aliases: ["avocado"],
    servingUnit: "piece",
    calories: 240,
    protein: 3,
    fiber: 10,
    unitMultipliers: { piece: 1, serving: 0.5, cup: 1, gram: 1 / 150, ounce: 1 / 5.3 }
  },
  {
    name: "Banana",
    aliases: ["banana"],
    servingUnit: "piece",
    calories: 105,
    protein: 1.3,
    fiber: 3.1,
    unitMultipliers: { piece: 1, serving: 1, gram: 1 / 118, ounce: 1 / 4.2 }
  },
  {
    name: "Apple",
    aliases: ["apple"],
    servingUnit: "piece",
    calories: 95,
    protein: 0.5,
    fiber: 4.4,
    unitMultipliers: { piece: 1, serving: 1, gram: 1 / 182, ounce: 1 / 6.4 }
  },
  {
    name: "Berries",
    aliases: ["berries", "blueberries", "strawberries", "raspberries"],
    servingUnit: "cup",
    calories: 85,
    protein: 1.1,
    fiber: 3.6,
    unitMultipliers: { cup: 1, serving: 1, gram: 1 / 148, ounce: 1 / 5.2 }
  },
  {
    name: "Broccoli",
    aliases: ["broccoli"],
    servingUnit: "cup",
    calories: 55,
    protein: 3.7,
    fiber: 5.1,
    unitMultipliers: { cup: 1, serving: 1, gram: 1 / 156, ounce: 1 / 5.5 }
  },
  {
    name: "Spinach",
    aliases: ["spinach"],
    servingUnit: "cup",
    calories: 7,
    protein: 0.9,
    fiber: 0.7,
    unitMultipliers: { cup: 1, serving: 1, gram: 1 / 30, ounce: 1 / 1.1 }
  },
  {
    name: "Almonds",
    aliases: ["almonds", "almond"],
    servingUnit: "ounce",
    calories: 164,
    protein: 6,
    fiber: 3.5,
    unitMultipliers: { ounce: 1, handful: 1, serving: 1, gram: 1 / 28.35, cup: 4.9 }
  },
  {
    name: "Peanut butter",
    aliases: ["peanut butter"],
    servingUnit: "tablespoon",
    calories: 95,
    protein: 3.5,
    fiber: 1,
    unitMultipliers: { tablespoon: 1, teaspoon: 1 / 3, serving: 2, gram: 1 / 16 }
  },
  {
    name: "Protein shake",
    aliases: ["protein shake", "protein powder"],
    servingUnit: "scoop",
    calories: 120,
    protein: 24,
    fiber: 1,
    unitMultipliers: { scoop: 1, serving: 1 }
  },
  {
    name: "Protein bar",
    aliases: ["protein bar"],
    servingUnit: "bar",
    calories: 200,
    protein: 20,
    fiber: 6,
    unitMultipliers: { bar: 1, serving: 1 }
  },
  {
    name: "Whole wheat bread",
    aliases: ["whole wheat bread", "bread", "toast"],
    servingUnit: "slice",
    calories: 80,
    protein: 4,
    fiber: 2,
    unitMultipliers: { slice: 1, piece: 1, serving: 1 }
  }
];

function normalizeInput(input: string) {
  return input
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseQuantity(input: string) {
  const fraction = input.match(/\b(\d+)\s*\/\s*(\d+)\b/);
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (denominator) return numerator / denominator;
  }

  const decimal = input.match(/\b\d+(?:\.\d+)?\b/);
  if (decimal) {
    return Number(decimal[0]);
  }

  for (const [word, value] of Object.entries(quantityWords)) {
    if (new RegExp(`\\b${word}\\b`).test(input)) {
      return value;
    }
  }

  return 1;
}

function parseUnit(input: string, food: FoodProfile) {
  for (const [alias, unit] of Object.entries(unitAliases)) {
    if (new RegExp(`\\b${alias}\\b`).test(input) && food.unitMultipliers[unit]) {
      return unit;
    }
  }

  return food.servingUnit;
}

function findFood(input: string) {
  return foods
    .flatMap((food) => food.aliases.map((alias) => ({ food, alias })))
    .filter(({ alias }) => new RegExp(`\\b${alias.replace(/\s+/g, "\\s+")}\\b`).test(input))
    .sort((a, b) => b.alias.length - a.alias.length)[0]?.food;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}

export function estimateFoodNutrition(input: string): NutritionEstimate | null {
  const normalizedInput = normalizeInput(input);
  if (!normalizedInput) {
    return null;
  }

  const food = findFood(normalizedInput);
  if (!food) {
    return null;
  }

  const quantity = parseQuantity(normalizedInput);
  const unit = parseUnit(normalizedInput, food);
  const multiplier = quantity * (food.unitMultipliers[unit] ?? 1);

  return {
    input: input.trim(),
    matchedFoodName: food.name,
    quantityLabel: `${formatNumber(quantity)} ${unit}${quantity === 1 ? "" : "s"}`,
    calories: Math.round(food.calories * multiplier),
    protein: roundMacro(food.protein * multiplier),
    fiber: roundMacro(food.fiber * multiplier)
  };
}
