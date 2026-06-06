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

interface MealTemplate {
  keywords: string[];
  name: string;
  calories: number;
  protein: number;
  fiber: number;
}

interface FoodMatch {
  food: FoodProfile;
  alias: string;
  index: number;
  endIndex: number;
}

const quantityWords: Record<string, number> = {
  half: 0.5,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
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
  lb: "pound",
  pound: "pound",
  pounds: "pound",
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
  handfuls: "handful",
  patty: "patty",
  patties: "patty",
  tortilla: "tortilla",
  tortillas: "tortilla",
  bowl: "bowl",
  bowls: "bowl",
  plate: "plate",
  plates: "plate",
  bun: "bun",
  buns: "bun"
};

const foods: FoodProfile[] = [
  { name: "Cottage cheese", aliases: ["cottage cheese"], servingUnit: "cup", calories: 180, protein: 26, fiber: 0, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 226, ounce: 1 / 8 } },
  { name: "Greek yogurt", aliases: ["greek yogurt", "yogurt"], servingUnit: "cup", calories: 130, protein: 23, fiber: 0, unitMultipliers: { cup: 1, serving: 0.75, gram: 1 / 245, ounce: 1 / 8.6 } },
  { name: "Egg", aliases: ["egg", "eggs"], servingUnit: "egg", calories: 72, protein: 6, fiber: 0, unitMultipliers: { egg: 1, piece: 1, serving: 1 } },
  { name: "Chicken breast", aliases: ["chicken breast", "grilled chicken", "chicken"], servingUnit: "ounce", calories: 47, protein: 8.8, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, pound: 16, serving: 3 } },
  { name: "Turkey burger patty", aliases: ["turkey burger patty", "turkey burger patties", "turkey burger"], servingUnit: "patty", calories: 170, protein: 22, fiber: 0, unitMultipliers: { patty: 1, piece: 1, serving: 1 } },
  { name: "Turkey", aliases: ["turkey"], servingUnit: "ounce", calories: 45, protein: 8, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, serving: 3 } },
  { name: "Steak", aliases: ["steak", "beef"], servingUnit: "ounce", calories: 65, protein: 7, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, pound: 16, serving: 4 } },
  { name: "Ground beef", aliases: ["ground beef"], servingUnit: "ounce", calories: 71, protein: 7, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, pound: 16, serving: 4 } },
  { name: "Pork", aliases: ["pork"], servingUnit: "ounce", calories: 60, protein: 7, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, serving: 3 } },
  { name: "Salmon", aliases: ["salmon"], servingUnit: "ounce", calories: 58, protein: 6.2, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, serving: 3 } },
  { name: "Shrimp", aliases: ["shrimp"], servingUnit: "ounce", calories: 28, protein: 6, fiber: 0, unitMultipliers: { ounce: 1, gram: 1 / 28.35, serving: 3 } },
  { name: "Tuna", aliases: ["tuna"], servingUnit: "can", calories: 120, protein: 26, fiber: 0, unitMultipliers: { can: 1, serving: 1, ounce: 1 / 5, gram: 1 / 142 } },
  { name: "Tofu", aliases: ["tofu"], servingUnit: "cup", calories: 180, protein: 20, fiber: 2.8, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 252, ounce: 1 / 8.9 } },
  { name: "Lentils", aliases: ["lentils", "lentil"], servingUnit: "cup", calories: 230, protein: 18, fiber: 15.6, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 198, ounce: 1 / 7 } },
  { name: "Black beans", aliases: ["black beans", "beans"], servingUnit: "cup", calories: 227, protein: 15, fiber: 15, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 172, ounce: 1 / 6.1 } },
  { name: "Chickpeas", aliases: ["chickpeas", "garbanzo beans"], servingUnit: "cup", calories: 269, protein: 14.5, fiber: 12.5, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 164, ounce: 1 / 5.8 } },
  { name: "Edamame", aliases: ["edamame"], servingUnit: "cup", calories: 188, protein: 18.5, fiber: 8, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 155, ounce: 1 / 5.5 } },
  { name: "Oatmeal", aliases: ["oatmeal", "oats"], servingUnit: "cup", calories: 154, protein: 6, fiber: 4, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 234, ounce: 1 / 8.3 } },
  { name: "Rice", aliases: ["white rice", "brown rice", "rice"], servingUnit: "cup", calories: 216, protein: 5, fiber: 3.5, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 195, ounce: 1 / 6.9 } },
  { name: "Quinoa", aliases: ["quinoa"], servingUnit: "cup", calories: 222, protein: 8, fiber: 5, unitMultipliers: { cup: 1, serving: 0.5, gram: 1 / 185, ounce: 1 / 6.5 } },
  { name: "Pasta", aliases: ["pasta", "spaghetti", "noodles"], servingUnit: "cup", calories: 220, protein: 8, fiber: 2.5, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 140, ounce: 1 / 5 } },
  { name: "Potato", aliases: ["potato", "potatoes"], servingUnit: "piece", calories: 161, protein: 4.3, fiber: 3.8, unitMultipliers: { piece: 1, serving: 1, cup: 0.85, gram: 1 / 173, ounce: 1 / 6.1 } },
  { name: "Sweet potato", aliases: ["sweet potato", "sweet potatoes"], servingUnit: "piece", calories: 112, protein: 2, fiber: 3.9, unitMultipliers: { piece: 1, serving: 1, cup: 1.6, gram: 1 / 130, ounce: 1 / 4.6 } },
  { name: "Avocado", aliases: ["avocado"], servingUnit: "piece", calories: 240, protein: 3, fiber: 10, unitMultipliers: { piece: 1, serving: 0.5, cup: 1, gram: 1 / 150, ounce: 1 / 5.3 } },
  { name: "Banana", aliases: ["banana"], servingUnit: "piece", calories: 105, protein: 1.3, fiber: 3.1, unitMultipliers: { piece: 1, serving: 1, gram: 1 / 118, ounce: 1 / 4.2 } },
  { name: "Apple", aliases: ["apple"], servingUnit: "piece", calories: 95, protein: 0.5, fiber: 4.4, unitMultipliers: { piece: 1, serving: 1, gram: 1 / 182, ounce: 1 / 6.4 } },
  { name: "Berries", aliases: ["berries", "blueberries", "strawberries", "raspberries"], servingUnit: "cup", calories: 85, protein: 1.1, fiber: 3.6, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 148, ounce: 1 / 5.2 } },
  { name: "Broccoli", aliases: ["broccoli"], servingUnit: "cup", calories: 55, protein: 3.7, fiber: 5.1, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 156, ounce: 1 / 5.5 } },
  { name: "Spinach", aliases: ["spinach"], servingUnit: "cup", calories: 7, protein: 0.9, fiber: 0.7, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 30, ounce: 1 / 1.1 } },
  { name: "Mixed salad", aliases: ["salad", "mixed greens"], servingUnit: "bowl", calories: 140, protein: 4, fiber: 5, unitMultipliers: { bowl: 1, plate: 1, cup: 0.2, serving: 1 } },
  { name: "Almonds", aliases: ["almonds", "almond"], servingUnit: "ounce", calories: 164, protein: 6, fiber: 3.5, unitMultipliers: { ounce: 1, handful: 1, serving: 1, gram: 1 / 28.35, cup: 4.9 } },
  { name: "Peanut butter", aliases: ["peanut butter"], servingUnit: "tablespoon", calories: 95, protein: 3.5, fiber: 1, unitMultipliers: { tablespoon: 1, teaspoon: 1 / 3, serving: 2, gram: 1 / 16 } },
  { name: "Protein shake", aliases: ["protein shake", "protein powder"], servingUnit: "scoop", calories: 120, protein: 24, fiber: 1, unitMultipliers: { scoop: 1, serving: 1 } },
  { name: "Protein bar", aliases: ["protein bar"], servingUnit: "bar", calories: 200, protein: 20, fiber: 6, unitMultipliers: { bar: 1, serving: 1 } },
  { name: "Whole wheat bread", aliases: ["whole wheat bread", "bread", "toast"], servingUnit: "slice", calories: 80, protein: 4, fiber: 2, unitMultipliers: { slice: 1, piece: 1, serving: 1 } },
  { name: "Tortilla", aliases: ["tortilla"], servingUnit: "tortilla", calories: 140, protein: 4, fiber: 2, unitMultipliers: { tortilla: 1, piece: 1, serving: 1 } },
  { name: "American cheese", aliases: ["american cheese"], servingUnit: "slice", calories: 60, protein: 3.5, fiber: 0, unitMultipliers: { slice: 1, ounce: 1.6, serving: 1, gram: 1 / 19 } },
  { name: "Cheese", aliases: ["cheese", "cheddar", "mozzarella"], servingUnit: "ounce", calories: 113, protein: 7, fiber: 0, unitMultipliers: { ounce: 1, slice: 0.75, serving: 1, gram: 1 / 28.35 } },
  { name: "Wheat bun", aliases: ["whole wheat bun", "wheat bun", "burger bun", "bun"], servingUnit: "bun", calories: 160, protein: 6, fiber: 4, unitMultipliers: { bun: 1, piece: 1 } },
  { name: "Milk", aliases: ["milk"], servingUnit: "cup", calories: 122, protein: 8, fiber: 0, unitMultipliers: { cup: 1, serving: 1, ounce: 1 / 8 } },
  { name: "Hummus", aliases: ["hummus"], servingUnit: "tablespoon", calories: 27, protein: 1.2, fiber: 0.9, unitMultipliers: { tablespoon: 1, serving: 4, cup: 16, gram: 1 / 15 } },
  { name: "Pizza", aliases: ["pizza"], servingUnit: "slice", calories: 285, protein: 12, fiber: 2.5, unitMultipliers: { slice: 1, piece: 1, serving: 1 } },
  { name: "Burger", aliases: ["cheeseburger", "burger", "hamburger"], servingUnit: "serving", calories: 520, protein: 28, fiber: 2, unitMultipliers: { serving: 1, piece: 1, patty: 0.55 } },
  { name: "Fries", aliases: ["fries", "french fries"], servingUnit: "serving", calories: 365, protein: 4, fiber: 4, unitMultipliers: { serving: 1, cup: 0.45, ounce: 0.18, gram: 1 / 140 } },
  { name: "Taco", aliases: ["taco", "tacos"], servingUnit: "piece", calories: 210, protein: 10, fiber: 3, unitMultipliers: { piece: 1, serving: 2 } },
  { name: "Burrito", aliases: ["burrito"], servingUnit: "piece", calories: 560, protein: 24, fiber: 8, unitMultipliers: { piece: 1, serving: 1 } },
  { name: "Sandwich", aliases: ["sandwich", "wrap"], servingUnit: "serving", calories: 420, protein: 24, fiber: 5, unitMultipliers: { serving: 1, piece: 1 } },
  { name: "Soup", aliases: ["soup", "chili"], servingUnit: "cup", calories: 180, protein: 10, fiber: 4, unitMultipliers: { cup: 1, bowl: 2, serving: 1.5 } },
  { name: "Smoothie", aliases: ["smoothie"], servingUnit: "serving", calories: 280, protein: 12, fiber: 5, unitMultipliers: { serving: 1, cup: 0.5 } },
  { name: "Sushi", aliases: ["sushi"], servingUnit: "piece", calories: 45, protein: 2, fiber: 0.4, unitMultipliers: { piece: 1, serving: 6 } },
  { name: "Cereal", aliases: ["cereal"], servingUnit: "cup", calories: 160, protein: 4, fiber: 3, unitMultipliers: { cup: 1, bowl: 1.5, serving: 1 } }
];

const mealTemplates: MealTemplate[] = [
  { keywords: ["breakfast"], name: "Estimated breakfast", calories: 420, protein: 22, fiber: 5 },
  { keywords: ["lunch"], name: "Estimated lunch", calories: 550, protein: 28, fiber: 6 },
  { keywords: ["dinner"], name: "Estimated dinner", calories: 650, protein: 35, fiber: 7 },
  { keywords: ["snack"], name: "Estimated snack", calories: 220, protein: 8, fiber: 3 },
  { keywords: ["meal"], name: "Estimated meal", calories: 550, protein: 28, fiber: 6 }
];

function normalizeInput(input: string) {
  return input
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseQuantityValue(value: string) {
  if (quantityWords[value]) {
    return quantityWords[value];
  }

  const fraction = value.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    return denominator ? Number(fraction[1]) / denominator : 1;
  }

  return Number.parseFloat(value) || 1;
}

function normalizeUnit(unit: string | undefined, fallback: string) {
  if (!unit) {
    return fallback;
  }

  return unitAliases[unit] ?? fallback;
}

function quantityPattern(unitOptional = true) {
  const words = Object.keys(quantityWords).join("|");
  const units = Object.keys(unitAliases).join("|");
  return new RegExp(`\\b(\\d+\\s*\\/\\s*\\d+|\\d+(?:\\.\\d+)?|${words})\\s*(${units})?\\b`, unitOptional ? "gi" : "g");
}

function lastSeparatorIndex(value: string) {
  return Math.max(value.lastIndexOf(" and "), value.lastIndexOf(" with "), value.lastIndexOf(" plus "), value.lastIndexOf(","), value.lastIndexOf("+"));
}

function parseServing(input: string, match: FoodMatch) {
  const before = input.slice(0, match.index);
  const separatorIndex = lastSeparatorIndex(before);
  const nearbyBefore = before.slice(Math.max(separatorIndex + 1, before.length - 42)).trim();
  const after = input.slice(match.endIndex, Math.min(input.length, match.endIndex + 28));
  const nearbyAfter = after.slice(0, Math.max(lastSeparatorIndex(after), 0) || after.length).trim();
  const contexts = [nearbyBefore, nearbyAfter];

  for (const context of contexts) {
    const matches = Array.from(context.matchAll(quantityPattern()));
    for (let index = matches.length - 1; index >= 0; index -= 1) {
      const lastMatch = matches[index];
      const unit = normalizeUnit(lastMatch[2], match.food.servingUnit);
      if (!match.food.unitMultipliers[unit]) continue;

      return {
        quantity: parseQuantityValue(lastMatch[1].replace(/\s+/g, "")),
        unit
      };
    }
  }

  return {
    quantity: 1,
    unit: match.food.unitMultipliers.serving ? "serving" : match.food.servingUnit
  };
}

function findFoodMatches(input: string) {
  const aliasMatches = foods
    .flatMap((food) =>
      food.aliases.map((alias) => {
        const normalizedAlias = alias.replace(/\s+/g, "\\s+");
        const regex = new RegExp(`\\b${normalizedAlias}\\b`, "g");
        return Array.from(input.matchAll(regex)).map((match) => ({
          food,
          alias,
          index: match.index ?? 0,
          endIndex: (match.index ?? 0) + match[0].length
        }));
      })
    )
    .flat()
    .sort((a, b) => b.alias.length - a.alias.length || a.index - b.index);

  const occupied = new Set<number>();
  const matches: FoodMatch[] = [];

  for (const match of aliasMatches) {
    const range = Array.from({ length: match.endIndex - match.index }, (_, index) => match.index + index);
    if (range.some((index) => occupied.has(index))) {
      continue;
    }

    range.forEach((index) => occupied.add(index));
    matches.push(match);
  }

  return matches.sort((a, b) => a.index - b.index);
}

function findTemplate(input: string) {
  return mealTemplates.find((template) => template.keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`).test(input)));
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

  const matches = findFoodMatches(normalizedInput);
  if (matches.length) {
    const lineItems = matches.map((match) => {
      const serving = parseServing(normalizedInput, match);
      const multiplier = serving.quantity * (match.food.unitMultipliers[serving.unit] ?? 1);
      return {
        name: match.food.name,
        quantityLabel: `${formatNumber(serving.quantity)} ${serving.unit}${serving.quantity === 1 ? "" : "s"}`,
        calories: Math.round(match.food.calories * multiplier),
        protein: roundMacro(match.food.protein * multiplier),
        fiber: roundMacro(match.food.fiber * multiplier)
      };
    });

    return {
      input: input.trim(),
      matchedFoodName: lineItems.map((item) => item.name).join(" + "),
      quantityLabel: lineItems.length === 1 ? lineItems[0].quantityLabel : `${lineItems.length} matched foods`,
      calories: lineItems.reduce((total, item) => total + item.calories, 0),
      protein: roundMacro(lineItems.reduce((total, item) => total + item.protein, 0)),
      fiber: roundMacro(lineItems.reduce((total, item) => total + item.fiber, 0))
    };
  }

  const template = findTemplate(normalizedInput) ?? { name: "Estimated meal", calories: 500, protein: 24, fiber: 5 };

  return {
    input: input.trim(),
    matchedFoodName: template.name,
    quantityLabel: "1 entry",
    calories: template.calories,
    protein: template.protein,
    fiber: template.fiber
  };
}
