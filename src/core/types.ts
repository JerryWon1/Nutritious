export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionItem {
  id: string;
  name: string;
  restaurant: string;
  aliases: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Official PDF filename when values were transcribed from chain nutrition PDFs. */
  nutritionSource?: string;
}

export interface ExtensionSettings {
  overlayEnabled: boolean;
}

export interface StoredState {
  macroGoals: MacroGoals;
  overlayEnabled: boolean;
}
