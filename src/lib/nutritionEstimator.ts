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

interface BrandedTemplate {
  brandKeywords: string[];
  itemKeywords: string[];
  name: string;
  quantityLabel: string;
  calories: number;
  protein: number;
  fiber: number;
}

interface BrandedIngredient {
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
  a: 1,
  an: 1,
  half: 0.5,
  quarter: 0.25,
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
  { name: "Avocado", aliases: ["avocados", "avocado"], servingUnit: "piece", calories: 240, protein: 3, fiber: 10, unitMultipliers: { piece: 1, serving: 0.5, cup: 1, gram: 1 / 150, ounce: 1 / 5.3 } },
  { name: "Banana", aliases: ["bananas", "banana"], servingUnit: "piece", calories: 105, protein: 1.3, fiber: 3.1, unitMultipliers: { piece: 1, serving: 1, gram: 1 / 118, ounce: 1 / 4.2 } },
  { name: "Apple", aliases: ["apples", "apple"], servingUnit: "piece", calories: 95, protein: 0.5, fiber: 4.4, unitMultipliers: { piece: 1, serving: 1, gram: 1 / 182, ounce: 1 / 6.4 } },
  { name: "Berries", aliases: ["berries", "blueberries", "strawberries", "raspberries"], servingUnit: "cup", calories: 85, protein: 1.1, fiber: 3.6, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 148, ounce: 1 / 5.2 } },
  { name: "Broccoli", aliases: ["broccoli"], servingUnit: "cup", calories: 55, protein: 3.7, fiber: 5.1, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 156, ounce: 1 / 5.5 } },
  { name: "Cabbage", aliases: ["shredded cabbage", "green cabbage", "red cabbage", "cabbage"], servingUnit: "cup", calories: 18, protein: 0.9, fiber: 1.8, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 70, ounce: 28.35 / 70 } },
  { name: "Carrots", aliases: ["shredded carrots", "carrot sticks", "carrots", "carrot"], servingUnit: "cup", calories: 52, protein: 1.2, fiber: 3.6, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 128, ounce: 28.35 / 128 } },
  { name: "Cauliflower", aliases: ["cauliflower"], servingUnit: "cup", calories: 27, protein: 2.1, fiber: 2.1, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 107, ounce: 28.35 / 107 } },
  { name: "Cucumber", aliases: ["cucumber", "cucumbers"], servingUnit: "cup", calories: 16, protein: 0.7, fiber: 0.5, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 104, ounce: 28.35 / 104 } },
  { name: "Kale", aliases: ["kale"], servingUnit: "cup", calories: 7, protein: 0.6, fiber: 0.8, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 21, ounce: 28.35 / 21 } },
  { name: "Romaine lettuce", aliases: ["romaine lettuce", "lettuce"], servingUnit: "cup", calories: 8, protein: 0.6, fiber: 1, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 47, ounce: 28.35 / 47 } },
  { name: "Tomato", aliases: ["tomatoes", "tomato"], servingUnit: "piece", calories: 22, protein: 1.1, fiber: 1.5, unitMultipliers: { piece: 1, serving: 1, cup: 1.45, gram: 1 / 123, ounce: 28.35 / 123 } },
  { name: "Bell pepper", aliases: ["bell pepper", "peppers", "pepper"], servingUnit: "cup", calories: 30, protein: 1, fiber: 2.5, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 92, ounce: 28.35 / 92 } },
  { name: "Onion", aliases: ["onions", "onion"], servingUnit: "cup", calories: 64, protein: 1.8, fiber: 2.7, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 160, ounce: 28.35 / 160 } },
  { name: "Zucchini", aliases: ["zucchini"], servingUnit: "cup", calories: 21, protein: 1.5, fiber: 1.2, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 124, ounce: 28.35 / 124 } },
  { name: "Spinach", aliases: ["spinach"], servingUnit: "cup", calories: 7, protein: 0.9, fiber: 0.7, unitMultipliers: { cup: 1, serving: 1, gram: 1 / 30, ounce: 1 / 1.1 } },
  { name: "Mixed salad", aliases: ["salad", "mixed greens"], servingUnit: "bowl", calories: 140, protein: 4, fiber: 5, unitMultipliers: { bowl: 1, plate: 1, cup: 0.2, serving: 1 } },
  { name: "Almonds", aliases: ["almonds", "almond"], servingUnit: "ounce", calories: 164, protein: 6, fiber: 3.5, unitMultipliers: { ounce: 1, handful: 1, serving: 1, gram: 1 / 28.35, cup: 4.9 } },
  { name: "Chia seeds", aliases: ["ground chia seeds", "chia seeds", "chia seed"], servingUnit: "tablespoon", calories: 58, protein: 2, fiber: 4.1, unitMultipliers: { tablespoon: 1, teaspoon: 1 / 3, serving: 2, gram: 1 / 12, ounce: 28.35 / 12 } },
  { name: "Ground flaxseed", aliases: ["ground flaxseed", "flaxseed", "flax seeds", "flax"], servingUnit: "tablespoon", calories: 37, protein: 1.3, fiber: 1.9, unitMultipliers: { tablespoon: 1, teaspoon: 1 / 3, serving: 2, gram: 1 / 7, ounce: 28.35 / 7 } },
  { name: "Hemp seeds", aliases: ["hemp hearts", "hemp seeds", "hemp seed"], servingUnit: "tablespoon", calories: 57, protein: 3.2, fiber: 0.3, unitMultipliers: { tablespoon: 1, teaspoon: 1 / 3, serving: 3, gram: 1 / 10, ounce: 28.35 / 10 } },
  { name: "Pumpkin seeds", aliases: ["pumpkin seeds", "pepitas"], servingUnit: "ounce", calories: 158, protein: 8.6, fiber: 1.7, unitMultipliers: { ounce: 1, handful: 1, serving: 1, tablespoon: 0.25, teaspoon: 1 / 12, gram: 1 / 28.35 } },
  { name: "Walnuts", aliases: ["walnuts", "walnut"], servingUnit: "ounce", calories: 185, protein: 4.3, fiber: 1.9, unitMultipliers: { ounce: 1, handful: 1, serving: 1, cup: 4.2, gram: 1 / 28.35 } },
  { name: "Pecans", aliases: ["pecans", "pecan"], servingUnit: "ounce", calories: 196, protein: 2.6, fiber: 2.7, unitMultipliers: { ounce: 1, handful: 1, serving: 1, cup: 3.9, gram: 1 / 28.35 } },
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

const brandedTemplates: BrandedTemplate[] = [
  {
    brandKeywords: ["starbucks"],
    itemKeywords: ["caramel", "macchiato"],
    name: "Starbucks Caramel Macchiato",
    quantityLabel: "1 grande/default serving",
    calories: 250,
    protein: 10,
    fiber: 0
  },
  {
    brandKeywords: ["starbucks"],
    itemKeywords: ["latte"],
    name: "Starbucks latte",
    quantityLabel: "1 grande/default serving",
    calories: 190,
    protein: 13,
    fiber: 0
  },
  {
    brandKeywords: ["costco", "westend", "west end"],
    itemKeywords: ["mediterranean", "chicken"],
    name: "Costco Mediterranean chicken bites/skewers",
    quantityLabel: "1 serving/default serving",
    calories: 150,
    protein: 24,
    fiber: 0
  },
  {
    brandKeywords: ["kirkland", "costco"],
    itemKeywords: ["chocolate", "protein", "shake"],
    name: "Kirkland Signature chocolate protein shake",
    quantityLabel: "1 shake/default serving",
    calories: 160,
    protein: 30,
    fiber: 0
  },
  {
    brandKeywords: ["fiber one", "fibre one"],
    itemKeywords: ["brownie"],
    name: "Fiber One chocolate brownie",
    quantityLabel: "1 brownie/default serving",
    calories: 70,
    protein: 1,
    fiber: 5
  }
];

const chipotleIngredients: BrandedIngredient[] = [
  { keywords: ["chicken"], name: "Chipotle chicken", calories: 180, protein: 32, fiber: 0 },
  { keywords: ["steak"], name: "Chipotle steak", calories: 150, protein: 21, fiber: 0 },
  { keywords: ["barbacoa"], name: "Chipotle barbacoa", calories: 170, protein: 24, fiber: 0 },
  { keywords: ["carnitas"], name: "Chipotle carnitas", calories: 210, protein: 23, fiber: 0 },
  { keywords: ["sofritas"], name: "Chipotle sofritas", calories: 150, protein: 8, fiber: 3 },
  { keywords: ["white rice"], name: "White rice", calories: 210, protein: 4, fiber: 1 },
  { keywords: ["brown rice"], name: "Brown rice", calories: 210, protein: 4, fiber: 2 },
  { keywords: ["black beans"], name: "Black beans", calories: 130, protein: 8, fiber: 8 },
  { keywords: ["pinto beans"], name: "Pinto beans", calories: 130, protein: 8, fiber: 8 },
  { keywords: ["fajita", "fajita veggies", "peppers"], name: "Fajita veggies", calories: 20, protein: 1, fiber: 1 },
  { keywords: ["fresh tomato salsa", "mild salsa", "tomato salsa", "salsa"], name: "Fresh tomato salsa", calories: 25, protein: 0, fiber: 1 },
  { keywords: ["corn salsa"], name: "Roasted chili-corn salsa", calories: 80, protein: 3, fiber: 3 },
  { keywords: ["green salsa", "tomatillo green"], name: "Tomatillo-green chili salsa", calories: 15, protein: 0, fiber: 0 },
  { keywords: ["red salsa", "hot salsa", "tomatillo red"], name: "Tomatillo-red chili salsa", calories: 30, protein: 0, fiber: 0 },
  { keywords: ["sour cream"], name: "Sour cream", calories: 110, protein: 2, fiber: 0 },
  { keywords: ["cheese"], name: "Cheese", calories: 110, protein: 6, fiber: 0 },
  { keywords: ["guac", "guacamole"], name: "Guacamole", calories: 230, protein: 2, fiber: 6 },
  { keywords: ["lettuce", "romaine"], name: "Romaine lettuce", calories: 5, protein: 0, fiber: 1 }
];

const defaultChipotleChickenBowl = ["chicken", "white rice", "black beans", "fresh tomato salsa", "cheese", "lettuce"];

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

function bareUnitPattern() {
  const units = Object.keys(unitAliases).join("|");
  return new RegExp(`\\b(${units})\\b`, "gi");
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

    const bareMatches = Array.from(context.matchAll(bareUnitPattern()));
    for (let index = bareMatches.length - 1; index >= 0; index -= 1) {
      const unit = normalizeUnit(bareMatches[index][1], match.food.servingUnit);
      if (!match.food.unitMultipliers[unit]) continue;

      return {
        quantity: 1,
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

function hasKeyword(input: string, keyword: string) {
  return new RegExp(`\\b${keyword.replace(/\s+/g, "\\s+")}\\b`).test(input);
}

function findBrandedTemplates(input: string) {
  const estimates: NutritionEstimate[] = [];
  const chipotleEstimate = estimateChipotle(input);
  if (chipotleEstimate) {
    estimates.push(chipotleEstimate);
  }

  brandedTemplates
    .filter(
      (candidate) => candidate.brandKeywords.some((keyword) => hasKeyword(input, keyword)) && candidate.itemKeywords.every((keyword) => hasKeyword(input, keyword))
    )
    .forEach((template) => {
      estimates.push({
        input,
        matchedFoodName: template.name,
        quantityLabel: template.quantityLabel,
        calories: template.calories,
        protein: template.protein,
        fiber: template.fiber
      });
    });

  return estimates;
}

function estimateChipotle(input: string): NutritionEstimate | null {
  if (!hasKeyword(input, "chipotle")) {
    return null;
  }

  const isBowl = hasKeyword(input, "bowl") || hasKeyword(input, "burrito bowl");
  if (!isBowl) {
    return null;
  }

  const selectedIngredients = chipotleIngredients.filter((ingredient) => ingredient.keywords.some((keyword) => hasKeyword(input, keyword)));
  const proteinOnly = selectedIngredients.length === 1 && ["chicken", "steak", "barbacoa", "carnitas", "sofritas"].some((keyword) => selectedIngredients[0].keywords.includes(keyword));
  const useDefaultBowl = !selectedIngredients.length || proteinOnly;
  const ingredients = useDefaultBowl
    ? chipotleIngredients.filter((ingredient) => defaultChipotleChickenBowl.some((keyword) => ingredient.keywords.includes(keyword)))
    : selectedIngredients;

  return {
    input,
    matchedFoodName: useDefaultBowl ? "Chipotle chicken bowl estimate" : `Chipotle bowl: ${ingredients.map((ingredient) => ingredient.name).join(" + ")}`,
    quantityLabel: "1 bowl/default serving",
    calories: ingredients.reduce((total, ingredient) => total + ingredient.calories, 0),
    protein: roundMacro(ingredients.reduce((total, ingredient) => total + ingredient.protein, 0)),
    fiber: roundMacro(ingredients.reduce((total, ingredient) => total + ingredient.fiber, 0))
  };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function formatUnit(unit: string, quantity: number) {
  if (quantity === 1) return unit;
  if (unit.endsWith("y")) return `${unit.slice(0, -1)}ies`;
  return `${unit}s`;
}

function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}

export function estimateFoodNutrition(input: string): NutritionEstimate | null {
  const normalizedInput = normalizeInput(input);
  if (!normalizedInput) {
    return null;
  }

  const brandedEstimates = findBrandedTemplates(normalizedInput);
  if (brandedEstimates.length) {
    return {
      input: input.trim(),
      matchedFoodName: brandedEstimates.map((estimate) => estimate.matchedFoodName).join(" + "),
      quantityLabel: brandedEstimates.length === 1 ? brandedEstimates[0].quantityLabel : `${brandedEstimates.length} branded items`,
      calories: brandedEstimates.reduce((total, estimate) => total + estimate.calories, 0),
      protein: roundMacro(brandedEstimates.reduce((total, estimate) => total + estimate.protein, 0)),
      fiber: roundMacro(brandedEstimates.reduce((total, estimate) => total + estimate.fiber, 0))
    };
  }

  const matches = findFoodMatches(normalizedInput);
  if (matches.length) {
    const lineItems = matches.map((match) => {
      const serving = parseServing(normalizedInput, match);
      const multiplier = serving.quantity * (match.food.unitMultipliers[serving.unit] ?? 1);
      return {
        name: match.food.name,
        quantityLabel: `${formatNumber(serving.quantity)} ${formatUnit(serving.unit, serving.quantity)}`,
        calories: Math.round(match.food.calories * multiplier),
        protein: roundMacro(match.food.protein * multiplier),
        fiber: roundMacro(match.food.fiber * multiplier)
      };
    });

    return {
      input: input.trim(),
      matchedFoodName: lineItems.length === 1 ? lineItems[0].name : lineItems.map((item) => `${item.quantityLabel} ${item.name}`).join(" + "),
      quantityLabel: lineItems.length === 1 ? lineItems[0].quantityLabel : `${lineItems.length} matched foods`,
      calories: lineItems.reduce((total, item) => total + item.calories, 0),
      protein: roundMacro(lineItems.reduce((total, item) => total + item.protein, 0)),
      fiber: roundMacro(lineItems.reduce((total, item) => total + item.fiber, 0))
    };
  }

  return null;
}
