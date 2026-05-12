import type { NutritionItem } from "./types";

/**
 * Values transcribed from official nutrition PDFs (see project README or your local copies).
 * PDF paths used for extraction: Documents/{mcdonalds-nutrition-facts,Taco_bell,subway,wendy's,Daves_Hot_Chicken_Menu_Nutrition_Guide,DominosNutritionGuide,Starbucks}.pdf
 */
export const PDF_SOURCED_NUTRITION: NutritionItem[] = [
  // McDonald’s — mcdonalds-nutrition-facts.pdf
  { id: "mc_big_mac_pdf", name: "Big Mac", restaurant: "McDonald's", aliases: ["big mac"], calories: 540, protein: 25, carbs: 47, fat: 28, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcchicken_pdf", name: "McChicken", restaurant: "McDonald's", aliases: ["mcchicken"], calories: 370, protein: 14, carbs: 40, fat: 17, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_nuggets_10_pdf", name: "10 pc Chicken McNuggets", restaurant: "McDonald's", aliases: ["10 piece chicken mcnuggets", "10 pc nuggets", "chicken mcnuggets 10"], calories: 470, protein: 22, carbs: 30, fat: 30, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_nuggets_6_pdf", name: "Chicken McNuggets (6 piece)", restaurant: "McDonald's", aliases: ["6 piece mcnuggets", "6 pc nuggets", "6 piece chicken mcnuggets", "6 pc chicken mcnuggets"], calories: 280, protein: 13, carbs: 18, fat: 18, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  {
    id: "mc_nuggets_4_pdf",
    name: "4 pc Chicken McNuggets",
    restaurant: "McDonald's",
    aliases: [
      "4 piece chicken mcnuggets",
      "4 pc chicken mcnuggets",
      "4 piece mcnuggets",
      "4 pc mcnuggets",
      "4 piece chicken mcnuggets reg",
      "4 chicken mcnuggets"
    ],
    calories: 170,
    protein: 9,
    carbs: 17,
    fat: 10,
    nutritionSource: "mcdonalds-nutrition-facts.pdf"
  },
  { id: "mc_quarter_pdf", name: "Quarter Pounder with Cheese", restaurant: "McDonald's", aliases: ["quarter pounder with cheese", "quarter pounder"], calories: 520, protein: 31, carbs: 42, fat: 26, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_hamburger_pdf", name: "Hamburger", restaurant: "McDonald's", aliases: ["hamburger"], calories: 250, protein: 12, carbs: 32, fat: 8, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_cheeseburger_pdf", name: "Cheeseburger", restaurant: "McDonald's", aliases: ["cheeseburger"], calories: 300, protein: 15, carbs: 33, fat: 12, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcdouble_pdf", name: "McDouble", restaurant: "McDonald's", aliases: ["mcdouble"], calories: 390, protein: 22, carbs: 34, fat: 18, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  {
    id: "mc_fries_medium_pdf",
    name: "Medium French Fries",
    restaurant: "McDonald's",
    aliases: [
      "medium fries",
      "french fries medium",
      "fries",
      "french fries",
      "mcdonalds fries",
      "mc donald fries",
      "mc fries",
      "world famous fries"
    ],
    calories: 340,
    protein: 4,
    carbs: 44,
    fat: 16,
    nutritionSource: "mcdonalds-nutrition-facts.pdf"
  },
  {
    id: "mc_fries_small_pdf",
    name: "Small French Fries",
    restaurant: "McDonald's",
    aliases: ["small fries", "small french fries"],
    calories: 230,
    protein: 3,
    carbs: 29,
    fat: 11,
    nutritionSource: "mcdonalds-nutrition-facts.pdf"
  },
  {
    id: "mc_fries_large_pdf",
    name: "Large French Fries",
    restaurant: "McDonald's",
    aliases: ["large fries", "large french fries"],
    calories: 480,
    protein: 6,
    carbs: 63,
    fat: 24,
    nutritionSource: "mcdonalds-nutrition-facts.pdf"
  },
  { id: "mc_egg_mcmuffin_pdf", name: "Egg McMuffin", restaurant: "McDonald's", aliases: ["egg mcmuffin"], calories: 300, protein: 17, carbs: 31, fat: 13, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_sausage_burrito_pdf", name: "Sausage Burrito", restaurant: "McDonald's", aliases: ["sausage burrito"], calories: 300, protein: 12, carbs: 26, fat: 16, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_sausage_mcmuffin_pdf", name: "Sausage McMuffin", restaurant: "McDonald's", aliases: ["sausage mcmuffin"], calories: 370, protein: 14, carbs: 29, fat: 23, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_filet_pdf", name: "Filet-O-Fish", restaurant: "McDonald's", aliases: ["filet o fish", "filet of fish"], calories: 390, protein: 15, carbs: 39, fat: 19, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_hash_browns_pdf", name: "Hash Browns", restaurant: "McDonald's", aliases: ["hash browns"], calories: 150, protein: 1, carbs: 15, fat: 9, nutritionSource: "mcdonalds-nutrition-facts.pdf" },

  // Taco Bell — Taco_bell.pdf
  { id: "tb_cantina_bowl_pdf", name: "Cantina Chicken Bowl", restaurant: "Taco Bell", aliases: ["cantina chicken bowl", "cantina bowl"], calories: 480, protein: 24, carbs: 44, fat: 23, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_cheesy_gordita_pdf", name: "Cheesy Gordita Crunch", restaurant: "Taco Bell", aliases: ["cheesy gordita crunch"], calories: 480, protein: 20, carbs: 44, fat: 26, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_crunchy_taco_pdf", name: "Crunchy Taco", restaurant: "Taco Bell", aliases: ["crunchy taco"], calories: 170, protein: 7, carbs: 13, fat: 9, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_soft_taco_pdf", name: "Soft Taco", restaurant: "Taco Bell", aliases: ["soft taco"], calories: 180, protein: 9, carbs: 19, fat: 9, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_bean_rice_burrito_pdf", name: "Cheesy Bean & Rice Burrito", restaurant: "Taco Bell", aliases: ["cheesy bean and rice burrito", "bean and rice burrito"], calories: 400, protein: 9, carbs: 56, fat: 16, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_nacho_fries_pdf", name: "Nacho Fries", restaurant: "Taco Bell", aliases: ["nacho fries"], calories: 350, protein: 4, carbs: 36, fat: 21, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_nacho_fries_large_pdf", name: "Large Nacho Fries", restaurant: "Taco Bell", aliases: ["large nacho fries"], calories: 500, protein: 6, carbs: 52, fat: 29, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_nachos_bellgrande_beef_pdf", name: "Nachos BellGrande (Beef)", restaurant: "Taco Bell", aliases: ["nachos bellgrande", "nachos bell grande"], calories: 730, protein: 17, carbs: 81, fat: 38, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_quesadilla_chicken_pdf", name: "Chicken Quesadilla", restaurant: "Taco Bell", aliases: ["chicken quesadilla"], calories: 490, protein: 26, carbs: 44, fat: 23, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_mexican_pizza_pdf", name: "Mexican Pizza", restaurant: "Taco Bell", aliases: ["mexican pizza"], calories: 530, protein: 20, carbs: 49, fat: 30, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_cinnamon_twists_pdf", name: "Cinnamon Twists", restaurant: "Taco Bell", aliases: ["cinnamon twists"], calories: 170, protein: 2, carbs: 27, fat: 6, nutritionSource: "Taco_bell.pdf" },

  // Subway — subway.pdf (6" sandwiches)
  { id: "sw_6_turkey_pdf", name: "6-inch Turkey Breast", restaurant: "Subway", aliases: ["6 inch turkey breast", "turkey breast 6", "6 turkey"], calories: 480, protein: 26, carbs: 42, fat: 23, nutritionSource: "subway.pdf" },
  { id: "sw_6_bmt_pdf", name: "6-inch B.M.T.", restaurant: "Subway", aliases: ["6 inch bmt", "6 bmt", "bmt 6 inch"], calories: 610, protein: 27, carbs: 44, fat: 36, nutritionSource: "subway.pdf" },
  { id: "sw_6_tuna_pdf", name: "6-inch Tuna", restaurant: "Subway", aliases: ["6 inch tuna", "6 tuna"], calories: 570, protein: 27, carbs: 42, fat: 33, nutritionSource: "subway.pdf" },
  { id: "sw_6_veggie_pdf", name: "6-inch Veggie Delite", restaurant: "Subway", aliases: ["veggie delite", "6 inch veggie"], calories: 320, protein: 17, carbs: 41, fat: 10, nutritionSource: "subway.pdf" },
  { id: "sw_6_meatball_pdf", name: "6-inch Meatball Marinara", restaurant: "Subway", aliases: ["meatball marinara 6", "6 inch meatball"], calories: 570, protein: 27, carbs: 53, fat: 28, nutritionSource: "subway.pdf" },

  // Wendy’s — wendy's.pdf
  { id: "wen_daves_single_pdf", name: "Dave's Single", restaurant: "Wendy's", aliases: ["daves single", "dave single"], calories: 524, protein: 28, carbs: 37, fat: 29, nutritionSource: "wendy's.pdf" },
  { id: "wen_baconator_pdf", name: "Baconator", restaurant: "Wendy's", aliases: ["baconator"], calories: 1001, protein: 63, carbs: 38, fat: 66, nutritionSource: "wendy's.pdf" },
  { id: "wen_spicy_chicken_pdf", name: "Spicy Chicken Sandwich", restaurant: "Wendy's", aliases: ["spicy chicken"], calories: 400, protein: 20, carbs: 45, fat: 15, nutritionSource: "wendy's.pdf" },
  {
    id: "wen_medium_fries_pdf",
    name: "Medium Fries",
    restaurant: "Wendy's",
    aliases: ["wendys medium fries", "wendy s medium fries", "wendys fries", "medium fries wendys"],
    calories: 176,
    protein: 2,
    carbs: 22,
    fat: 8,
    nutritionSource: "wendy's.pdf"
  },
  { id: "wen_chili_pdf", name: "Chili", restaurant: "Wendy's", aliases: ["wendys chili", "chili small"], calories: 253, protein: 19, carbs: 14, fat: 13, nutritionSource: "wendy's.pdf" },

  // Dave’s Hot Chicken — Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf
  { id: "dhc_slider_pdf", name: "Single Slider", restaurant: "Dave's Hot Chicken", aliases: ["single slider", "daves slider"], calories: 680, protein: 36, carbs: 65, fat: 32, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  { id: "dhc_tender_pdf", name: "Single Tender", restaurant: "Dave's Hot Chicken", aliases: ["single tender", "daves tender"], calories: 550, protein: 28, carbs: 45, fat: 26, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  {
    id: "dhc_fries_pdf",
    name: "Dave's Fries",
    restaurant: "Dave's Hot Chicken",
    aliases: ["daves fries", "dave s fries", "daves hot chicken fries"],
    calories: 440,
    protein: 8,
    carbs: 48,
    fat: 22,
    nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf"
  },

  // Domino’s — DominosNutritionGuide.pdf (10" hand tossed, 1/3 pizza)
  { id: "dz_hand_tossed_cheese_third_pdf", name: "Hand Tossed Cheese Pizza (1/3 small 10\")", restaurant: "Domino's", aliases: ["cheese pizza small", "dominos cheese pizza"], calories: 220, protein: 7, carbs: 40, fat: 3, nutritionSource: "DominosNutritionGuide.pdf" },

  // Starbucks — Starbucks.pdf (representative rows; re-verify from PDF if needed)
  { id: "sb_pike_tall_pdf", name: "Pike Place Brewed Coffee (Tall)", restaurant: "Starbucks", aliases: ["brewed coffee tall", "pike place tall"], calories: 5, protein: 0, carbs: 0, fat: 0, nutritionSource: "Starbucks.pdf" },
  { id: "sb_latte_grande_whole_pdf", name: "Caffè Latte (Grande, whole milk)", restaurant: "Starbucks", aliases: ["caffe latte grande", "latte grande"], calories: 218, protein: 11, carbs: 18, fat: 11, nutritionSource: "Starbucks.pdf" }
];
