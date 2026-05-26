import type { NutritionItem } from "./types";

/**
 * Values transcribed from official nutrition PDFs in Documents/ (see docs/OFFICIAL_NUTRITION_SOURCES.md).
 * Re-run: npm run extract-pdf -- Documents
 */
export const PDF_SOURCED_NUTRITION: NutritionItem[] = [
  // McDonald’s — mcdonalds-nutrition-facts.pdf
  { id: "mc_big_mac_pdf", name: "Big Mac", restaurant: "McDonald's", aliases: ["big mac"], calories: 540, protein: 25, carbs: 47, fat: 28, fiber: 3, sugar: 9, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcchicken_pdf", name: "McChicken", restaurant: "McDonald's", aliases: ["mcchicken"], calories: 370, protein: 14, carbs: 40, fat: 17, fiber: 2, sugar: 8, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_nuggets_10_pdf", name: "10 pc Chicken McNuggets", restaurant: "McDonald's", aliases: ["10 piece chicken mcnuggets", "10 pc nuggets", "chicken mcnuggets 10"], calories: 470, protein: 22, carbs: 30, fat: 30, fiber: 2, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_nuggets_6_pdf", name: "Chicken McNuggets (6 piece)", restaurant: "McDonald's", aliases: ["6 piece mcnuggets", "6 pc nuggets", "6 piece chicken mcnuggets", "6 pc chicken mcnuggets"], calories: 280, protein: 13, carbs: 18, fat: 18, fiber: 1, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
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
    calories: 190,
    protein: 9,
    carbs: 12,
    fat: 12,
    fiber: 1, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf"
  },
  { id: "mc_quarter_pdf", name: "Quarter Pounder with Cheese", restaurant: "McDonald's", aliases: ["quarter pounder with cheese", "quarter pounder"], calories: 520, protein: 31, carbs: 42, fat: 26, fiber: 3, sugar: 11, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_hamburger_pdf", name: "Hamburger", restaurant: "McDonald's", aliases: ["hamburger"], calories: 250, protein: 12, carbs: 32, fat: 8, fiber: 1, sugar: 6, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_cheeseburger_pdf", name: "Cheeseburger", restaurant: "McDonald's", aliases: ["cheeseburger"], calories: 300, protein: 15, carbs: 33, fat: 12, fiber: 2, sugar: 7, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcdouble_pdf", name: "McDouble", restaurant: "McDonald's", aliases: ["mcdouble"], calories: 390, protein: 22, carbs: 34, fat: 18, fiber: 2, sugar: 7, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
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
    fiber: 4, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf"
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
    fiber: 2, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf"
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
    fiber: 5, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf"
  },
  { id: "mc_egg_mcmuffin_pdf", name: "Egg McMuffin", restaurant: "McDonald's", aliases: ["egg mcmuffin"], calories: 300, protein: 17, carbs: 31, fat: 13, fiber: 2, sugar: 3, nutritionSource: "mcdonalds-nutrition-facts.pdf", diet: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false, nutFree: true } },
  { id: "mc_sausage_burrito_pdf", name: "Sausage Burrito", restaurant: "McDonald's", aliases: ["sausage burrito"], calories: 300, protein: 12, carbs: 26, fat: 16, fiber: 1, sugar: 2, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_sausage_mcmuffin_pdf", name: "Sausage McMuffin", restaurant: "McDonald's", aliases: ["sausage mcmuffin"], calories: 370, protein: 14, carbs: 29, fat: 23, fiber: 4, sugar: 2, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_filet_pdf", name: "Filet-O-Fish", restaurant: "McDonald's", aliases: ["filet o fish", "filet of fish"], calories: 390, protein: 15, carbs: 39, fat: 19, fiber: 2, sugar: 5, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_hash_browns_pdf", name: "Hash Browns", restaurant: "McDonald's", aliases: ["hash browns"], calories: 150, protein: 1, carbs: 15, fat: 9, fiber: 2, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf" },

  // Taco Bell — Taco_bell.pdf
  { id: "tb_cantina_bowl_pdf", name: "Cantina Chicken Bowl", restaurant: "Taco Bell", aliases: ["cantina chicken bowl", "cantina bowl"], calories: 480, protein: 24, carbs: 44, fat: 23, fiber: 8, sugar: 5, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_cheesy_gordita_pdf", name: "Cheesy Gordita Crunch", restaurant: "Taco Bell", aliases: ["cheesy gordita crunch"], calories: 480, protein: 20, carbs: 44, fat: 26, fiber: 8, sugar: 5, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_crunchy_taco_pdf", name: "Crunchy Taco", restaurant: "Taco Bell", aliases: ["crunchy taco"], calories: 170, protein: 7, carbs: 13, fat: 9, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_soft_taco_pdf", name: "Soft Taco", restaurant: "Taco Bell", aliases: ["soft taco"], calories: 180, protein: 9, carbs: 19, fat: 9, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_bean_rice_burrito_pdf", name: "Cheesy Bean & Rice Burrito", restaurant: "Taco Bell", aliases: ["cheesy bean and rice burrito", "bean and rice burrito"], calories: 400, protein: 9, carbs: 56, fat: 16, fiber: 12, sugar: 4, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_nacho_fries_pdf", name: "Nacho Fries", restaurant: "Taco Bell", aliases: ["nacho fries"], calories: 350, protein: 4, carbs: 36, fat: 21, fiber: 4, sugar: 1, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_nacho_fries_large_pdf", name: "Large Nacho Fries", restaurant: "Taco Bell", aliases: ["large nacho fries"], calories: 500, protein: 6, carbs: 52, fat: 29, fiber: 6, sugar: 2, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_nachos_bellgrande_beef_pdf", name: "Nachos BellGrande (Beef)", restaurant: "Taco Bell", aliases: ["nachos bellgrande", "nachos bell grande"], calories: 730, protein: 17, carbs: 81, fat: 38, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_quesadilla_chicken_pdf", name: "Chicken Quesadilla", restaurant: "Taco Bell", aliases: ["chicken quesadilla"], calories: 490, protein: 26, carbs: 44, fat: 23, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_mexican_pizza_pdf", name: "Mexican Pizza", restaurant: "Taco Bell", aliases: ["mexican pizza"], calories: 530, protein: 20, carbs: 49, fat: 30, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_cinnamon_twists_pdf", name: "Cinnamon Twists", restaurant: "Taco Bell", aliases: ["cinnamon twists"], calories: 170, protein: 2, carbs: 27, fat: 6, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },

  // Subway — subway.pdf (Sep 2024, 6" with default veggies)
  { id: "sw_6_turkey_pdf", name: "6-inch Oven Roasted Turkey", restaurant: "Subway", aliases: ["6 inch turkey breast", "turkey breast 6", "6 turkey", "oven roasted turkey 6"], calories: 270, protein: 20, carbs: 40, fat: 4, fiber: 6, sugar: 4, nutritionSource: "subway.pdf" },
  { id: "sw_6_bmt_pdf", name: "6-inch Ultimate B.M.T.", restaurant: "Subway", aliases: ["6 inch bmt", "6 bmt", "bmt 6 inch", "ultimate bmt"], calories: 560, protein: 27, carbs: 45, fat: 30, fiber: 0, sugar: 0, nutritionSource: "subway.pdf" },
  { id: "sw_6_tuna_pdf", name: "6-inch Tuna", restaurant: "Subway", aliases: ["6 inch tuna", "6 tuna"], calories: 480, protein: 20, carbs: 42, fat: 25, fiber: 5, sugar: 3, nutritionSource: "subway.pdf" },
  { id: "sw_6_veggie_pdf", name: "6-inch Veggie Delite", restaurant: "Subway", aliases: ["veggie delite", "6 inch veggie"], calories: 220, protein: 10, carbs: 40, fat: 3, fiber: 6, sugar: 4, nutritionSource: "subway.pdf" },
  { id: "sw_6_meatball_pdf", name: "6-inch Meatball Marinara", restaurant: "Subway", aliases: ["meatball marinara 6", "6 inch meatball"], calories: 460, protein: 20, carbs: 52, fat: 20, fiber: 4, sugar: 3, nutritionSource: "subway.pdf" },

  // Wendy’s — wendy's.pdf
  { id: "wen_daves_single_pdf", name: "Dave's Single", restaurant: "Wendy's", aliases: ["daves single", "dave single"], calories: 524, protein: 28, carbs: 37, fat: 29, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_baconator_pdf", name: "Baconator", restaurant: "Wendy's", aliases: ["baconator"], calories: 1001, protein: 63, carbs: 38, fat: 66, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_spicy_chicken_pdf", name: "Spicy Chicken Sandwich", restaurant: "Wendy's", aliases: ["spicy chicken"], calories: 400, protein: 20, carbs: 45, fat: 15, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  {
    id: "wen_medium_fries_pdf",
    name: "Medium Fries",
    restaurant: "Wendy's",
    aliases: ["wendys medium fries", "wendy s medium fries", "wendys fries", "medium fries wendys"],
    calories: 176,
    protein: 2,
    carbs: 22,
    fat: 8,
    fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf"
  },
  { id: "wen_chili_pdf", name: "Chili", restaurant: "Wendy's", aliases: ["wendys chili", "chili small"], calories: 253, protein: 19, carbs: 14, fat: 13, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },

  // Dave's Hot Chicken — Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf (UK guide; verify US menu)
  { id: "dhc_slider_pdf", name: "Single Slider", restaurant: "Dave's Hot Chicken", aliases: ["single slider", "daves slider"], calories: 553, protein: 35, carbs: 41, fat: 27, fiber: 2, sugar: 14, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  { id: "dhc_tender_pdf", name: "Single Tender", restaurant: "Dave's Hot Chicken", aliases: ["single tender", "daves tender"], calories: 449, protein: 30, carbs: 32, fat: 22, fiber: 2, sugar: 3, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  {
    id: "dhc_fries_pdf",
    name: "Loaded Fries (Small)",
    restaurant: "Dave's Hot Chicken",
    aliases: ["daves fries", "dave s fries", "daves hot chicken fries", "loaded fries"],
    calories: 958,
    protein: 20,
    carbs: 95,
    fat: 54,
    fiber: 3, sugar: 2, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf"
  },

  // Domino’s — DominosNutritionGuide.pdf (10" hand tossed, 1/3 pizza)
  { id: "dz_hand_tossed_cheese_third_pdf", name: "Hand Tossed Cheese Pizza (1/3 small 10\")", restaurant: "Domino's", aliases: ["cheese pizza small", "dominos cheese pizza"], calories: 220, protein: 7, carbs: 40, fat: 3, fiber: 1, sugar: 0, nutritionSource: "DominosNutritionGuide.pdf" },

  // Starbucks — Starbucks-food.pdf + Starbucks-beverages.pdf
  { id: "sb_pike_tall_pdf", name: "Pike Place Brewed Coffee (Tall)", restaurant: "Starbucks", aliases: ["brewed coffee tall", "pike place tall", "hot coffee tall"], calories: 5, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_latte_grande_whole_pdf", name: "Caffè Latte (Grande, whole milk)", restaurant: "Starbucks", aliases: ["caffe latte grande", "latte grande"], calories: 220, protein: 12, carbs: 18, fat: 11, fiber: 0, sugar: 18, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_caramel_frappuccino_pdf", name: "Caramel Frappuccino (Grande)", restaurant: "Starbucks", aliases: ["caramel frappuccino grande", "caramel frapp"], calories: 420, protein: 4, carbs: 67, fat: 14, fiber: 0, sugar: 0, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_bacon_gouda_pdf", name: "Bacon Gouda Breakfast Sandwich", restaurant: "Starbucks", aliases: ["bacon gouda sandwich", "bacon gouda breakfast"], calories: 360, protein: 19, carbs: 35, fat: 18, fiber: 1, sugar: 2, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_impossible_breakfast_pdf", name: "Impossible Breakfast Sandwich", restaurant: "Starbucks", aliases: ["impossible breakfast sandwich", "impossible sausage egg cheddar"], calories: 420, protein: 21, carbs: 36, fat: 22, fiber: 3, sugar: 4, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_spinach_feta_wrap_pdf", name: "Spinach Feta Wrap", restaurant: "Starbucks", aliases: ["spinach feta wrap"], calories: 290, protein: 20, carbs: 34, fat: 8, fiber: 3, sugar: 5, nutritionSource: "Starbucks-food.pdf" },

  // McDonald's — additional popular items
  { id: "mc_mcfries_kids_pdf", name: "Kids Fries", restaurant: "McDonald's", aliases: ["kids fries", "small fries kids"], calories: 110, protein: 1, carbs: 14, fat: 5, fiber: 1, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcflurry_oreo_pdf", name: "McFlurry with OREO Cookies", restaurant: "McDonald's", aliases: ["mcflurry oreo", "oreo mcflurry"], calories: 510, protein: 12, carbs: 80, fat: 16, fiber: 1, sugar: 64, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_grilled_chicken_pdf", name: "Artisan Grilled Chicken Sandwich", restaurant: "McDonald's", aliases: ["grilled chicken sandwich mcdonalds", "artisan grilled chicken"], calories: 360, protein: 33, carbs: 43, fat: 6, fiber: 3, sugar: 10, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_spicy_mcchicken_pdf", name: "Spicy McChicken", restaurant: "McDonald's", aliases: ["spicy mcchicken"], calories: 400, protein: 14, carbs: 47, fat: 17, fiber: 2, sugar: 8, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_apple_pie_pdf", name: "Baked Apple Pie", restaurant: "McDonald's", aliases: ["apple pie", "baked apple pie"], calories: 230, protein: 2, carbs: 33, fat: 11, fiber: 2, sugar: 13, nutritionSource: "mcdonalds-nutrition-facts.pdf" },

  // Taco Bell — additional
  { id: "tb_doritos_locos_pdf", name: "Doritos Locos Tacos Supreme", restaurant: "Taco Bell", aliases: ["doritos locos taco supreme", "locos taco supreme"], calories: 190, protein: 8, carbs: 15, fat: 11, fiber: 3, sugar: 2, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_black_bean_crunchwrap_pdf", name: "Black Bean Crunchwrap Supreme", restaurant: "Taco Bell", aliases: ["black bean crunchwrap"], calories: 510, protein: 14, carbs: 67, fat: 21, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_grilled_cheese_burrito_pdf", name: "Grilled Cheese Burrito", restaurant: "Taco Bell", aliases: ["grilled cheese burrito beef"], calories: 710, protein: 22, carbs: 73, fat: 38, fiber: 10, sugar: 5, nutritionSource: "Taco_bell.pdf" },
  { id: "tb_chalupa_supreme_pdf", name: "Chalupa Supreme (Beef)", restaurant: "Taco Bell", aliases: ["chalupa supreme beef", "chalupa supreme"], calories: 350, protein: 14, carbs: 30, fat: 20, fiber: 0, sugar: 0, nutritionSource: "Taco_bell.pdf" },

  // Subway — additional 6"
  { id: "sw_6_chicken_breast_pdf", name: "6-inch Grilled Chicken", restaurant: "Subway", aliases: ["6 inch oven roasted chicken", "oven roasted chicken 6", "grilled chicken 6 inch"], calories: 300, protein: 26, carbs: 40, fat: 5, fiber: 7, sugar: 5, nutritionSource: "subway.pdf" },
  { id: "sw_6_steak_cheese_pdf", name: "6-inch Steak & Cheese", restaurant: "Subway", aliases: ["6 inch steak and cheese", "steak and cheese 6"], calories: 370, protein: 26, carbs: 42, fat: 10, fiber: 5, sugar: 4, nutritionSource: "subway.pdf" },
  { id: "sw_6_ham_pdf", name: "6-inch Black Forest Ham", restaurant: "Subway", aliases: ["6 inch black forest ham", "black forest ham 6"], calories: 280, protein: 19, carbs: 42, fat: 5, fiber: 7, sugar: 4, nutritionSource: "subway.pdf" },
  { id: "sw_footlong_turkey_pdf", name: "Footlong Oven Roasted Turkey", restaurant: "Subway", aliases: ["footlong turkey breast", "turkey footlong"], calories: 540, protein: 40, carbs: 80, fat: 8, fiber: 12, sugar: 0, nutritionSource: "subway.pdf" },

  // Wendy's — additional
  { id: "wen_jr_bacon_cheeseburger_pdf", name: "Jr. Bacon Cheeseburger", restaurant: "Wendy's", aliases: ["jr bacon cheeseburger", "junior bacon cheeseburger"], calories: 380, protein: 19, carbs: 27, fat: 23, fiber: 1, sugar: 6, nutritionSource: "wendy's.pdf" },
  { id: "wen_apple_pecan_salad_pdf", name: "Apple Pecan Chicken Salad (Half)", restaurant: "Wendy's", aliases: ["apple pecan chicken salad", "apple pecan salad half"], calories: 340, protein: 19, carbs: 28, fat: 18, fiber: 2, sugar: 12, nutritionSource: "wendy's.pdf" },
  { id: "wen_frosty_chocolate_pdf", name: "Chocolate Frosty (Medium)", restaurant: "Wendy's", aliases: ["chocolate frosty medium", "medium frosty"], calories: 470, protein: 13, carbs: 74, fat: 13, fiber: 0, sugar: 55, nutritionSource: "wendy's.pdf" },
  { id: "wen_grilled_chicken_wrap_pdf", name: "Grilled Chicken Wrap", restaurant: "Wendy's", aliases: ["wendys grilled chicken wrap"], calories: 270, protein: 20, carbs: 24, fat: 10, fiber: 2, sugar: 1, nutritionSource: "wendy's.pdf" },

  // Domino's — additional
  { id: "dz_pepperoni_third_pdf", name: "Hand Tossed Pepperoni Pizza (1/3 small 10\")", restaurant: "Domino's", aliases: ["pepperoni pizza small dominos"], calories: 250, protein: 9, carbs: 40, fat: 6, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_pacific_veggie_third_pdf", name: "Pacific Veggie Pizza (1/3 small 10\")", restaurant: "Domino's", aliases: ["pacific veggie pizza small"], calories: 200, protein: 7, carbs: 38, fat: 3, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_chicken_alfredo_pasta_pdf", name: "Chicken Alfredo Pasta (small)", restaurant: "Domino's", aliases: ["chicken alfredo pasta dominos"], calories: 690, protein: 32, carbs: 78, fat: 28, fiber: 3, sugar: 0, nutritionSource: "DominosNutritionGuide.pdf" },

  // Dave's Hot Chicken — additional
  { id: "dhc_tenders_2_pdf", name: "2 Tenders", restaurant: "Dave's Hot Chicken", aliases: ["2 piece tenders", "two tenders daves"], calories: 898, protein: 60, carbs: 64, fat: 44, fiber: 3, sugar: 6, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  { id: "dhc_kale_slaw_pdf", name: "Kale Slaw", restaurant: "Dave's Hot Chicken", aliases: ["kale slaw daves"], calories: 180, protein: 2, carbs: 12, fat: 14, fiber: 2, sugar: 0, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },

  // Burger King — burger-king-nutrition.pdf (Nov 2022)
  { id: "bk_whopper", name: "Whopper", restaurant: "Burger King", aliases: ["whopper sandwich", "bk whopper"], calories: 670, protein: 31, carbs: 54, fat: 39, fiber: 3, sugar: 13, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_whopper_cheese", name: "Whopper with Cheese", restaurant: "Burger King", aliases: ["whopper with cheese", "cheese whopper"], calories: 760, protein: 36, carbs: 56, fat: 46, fiber: 3, sugar: 14, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_whopper_jr", name: "Whopper Jr.", restaurant: "Burger King", aliases: ["whopper jr", "whopper junior"], calories: 330, protein: 15, carbs: 30, fat: 18, fiber: 2, sugar: 7, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_chicken_fries", name: "Chicken Fries (9 pc)", restaurant: "Burger King", aliases: ["chicken fries", "bk chicken fries"], calories: 260, protein: 15, carbs: 20, fat: 13, fiber: 1, sugar: 0, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_crispy_chicken", name: "Classic Royal Crispy Chicken Sandwich", restaurant: "Burger King", aliases: ["crispy chicken sandwich bk", "royal crispy chicken"], calories: 600, protein: 31, carbs: 54, fat: 31, fiber: 9, sugar: 9, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_nuggets_10", name: "Chicken Nuggets (10 pc)", restaurant: "Burger King", aliases: ["10 piece chicken nuggets bk", "bk nuggets 10"], calories: 480, protein: 22, carbs: 30, fat: 31, fiber: 2, sugar: 0, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_fries_medium", name: "Medium French Fries", restaurant: "Burger King", aliases: ["bk medium fries", "burger king fries medium"], calories: 370, protein: 5, carbs: 54, fat: 16, fiber: 4, sugar: 1, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_hamburger", name: "Hamburger", restaurant: "Burger King", aliases: ["bk hamburger", "burger king hamburger"], calories: 250, protein: 13, carbs: 29, fat: 10, fiber: 1, sugar: 0, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_double_whopper", name: "Double Whopper", restaurant: "Burger King", aliases: ["double whopper"], calories: 920, protein: 52, carbs: 54, fat: 58, fiber: 3, sugar: 13, nutritionSource: "burger-king-nutrition.pdf" },

  // Panera — representative menu nutrition
  { id: "pan_broccoli_cheddar", name: "Broccoli Cheddar Soup (cup)", restaurant: "Panera", aliases: ["broccoli cheddar soup cup", "broccoli cheddar cup"], calories: 360, protein: 12, carbs: 18, fat: 27, fiber: 2, sugar: 6, nutritionSource: "panera-nutrition.pdf" },
  { id: "pan_turkey_avocado", name: "Turkey Avocado BLT", restaurant: "Panera", aliases: ["turkey avocado blt", "turkey avocado blt sandwich"], calories: 750, protein: 42, carbs: 62, fat: 38, fiber: 4, sugar: 8, nutritionSource: "panera-nutrition.pdf" },
  { id: "pan_greek_salad", name: "Greek Salad", restaurant: "Panera", aliases: ["panera greek salad"], calories: 400, protein: 8, carbs: 18, fat: 33, fiber: 4, sugar: 6, nutritionSource: "panera-nutrition.pdf" },
  { id: "pan_mac_cheese", name: "Mac & Cheese (small)", restaurant: "Panera", aliases: ["mac and cheese small panera", "mac cheese small"], calories: 470, protein: 20, carbs: 39, fat: 27, fiber: 1, sugar: 4, nutritionSource: "panera-nutrition.pdf" },
  { id: "pan_chicken_noodle", name: "Homestyle Chicken Noodle Soup (cup)", restaurant: "Panera", aliases: ["chicken noodle soup cup", "homestyle chicken noodle"], calories: 100, protein: 7, carbs: 12, fat: 3, fiber: 1, sugar: 2, nutritionSource: "panera-nutrition.pdf" },
  { id: "pan_fuji_apple", name: "Fuji Apple Chicken Salad", restaurant: "Panera", aliases: ["fuji apple chicken salad", "fuji apple salad"], calories: 570, protein: 33, carbs: 52, fat: 26, fiber: 6, sugar: 20, nutritionSource: "panera-nutrition.pdf" },
  { id: "pan_baguette", name: "French Baguette", restaurant: "Panera", aliases: ["french baguette panera", "baguette"], calories: 180, protein: 6, carbs: 36, fat: 1, fiber: 2, sugar: 1, nutritionSource: "panera-nutrition.pdf" },

  // Five Guys — representative burgers & fries
  { id: "fg_little_cheeseburger", name: "Little Cheeseburger", restaurant: "Five Guys", aliases: ["little cheeseburger five guys", "fg little cheeseburger"], calories: 550, protein: 27, carbs: 40, fat: 32, fiber: 2, sugar: 8, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_cheeseburger", name: "Cheeseburger", restaurant: "Five Guys", aliases: ["five guys cheeseburger", "fg cheeseburger"], calories: 840, protein: 47, carbs: 40, fat: 55, fiber: 2, sugar: 8, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_bacon_cheeseburger", name: "Bacon Cheeseburger", restaurant: "Five Guys", aliases: ["bacon cheeseburger five guys"], calories: 920, protein: 51, carbs: 40, fat: 62, fiber: 2, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_little_fries", name: "Little Fries", restaurant: "Five Guys", aliases: ["little fries five guys", "five guys little fries"], calories: 526, protein: 8, carbs: 72, fat: 23, fiber: 8, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_regular_fries", name: "Regular Fries", restaurant: "Five Guys", aliases: ["regular fries five guys", "five guys fries"], calories: 953, protein: 15, carbs: 131, fat: 41, fiber: 15, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_grilled_cheese", name: "Grilled Cheese", restaurant: "Five Guys", aliases: ["five guys grilled cheese"], calories: 470, protein: 18, carbs: 42, fat: 26, fiber: 2, sugar: 8, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_hamburger", name: "Hamburger", restaurant: "Five Guys", aliases: ["five guys hamburger", "fg hamburger"], calories: 542, protein: 23, carbs: 39, fat: 26, fiber: 2, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },

  // Chipotle — chipotle-us-nutrition-2025.pdf (typical bowl/burrito builds)
  { id: "chip_chicken_bowl_pdf", name: "Chicken Burrito Bowl", restaurant: "Chipotle", aliases: ["chicken bowl", "chipotle chicken bowl", "chicken burrito bowl"], calories: 550, protein: 50, carbs: 67, fat: 21, fiber: 15, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_steak_burrito_pdf", name: "Steak Burrito", restaurant: "Chipotle", aliases: ["chipotle steak burrito", "steak burrito"], calories: 835, protein: 41, carbs: 117, fat: 21, fiber: 12, sugar: 9, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_carnitas_bowl_pdf", name: "Carnitas Burrito Bowl", restaurant: "Chipotle", aliases: ["carnitas bowl", "carnitas burrito bowl"], calories: 580, protein: 35, carbs: 67, fat: 26, fiber: 15, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_sofritas_bowl_pdf", name: "Sofritas Bowl", restaurant: "Chipotle", aliases: ["sofritas bowl"], calories: 520, protein: 22, carbs: 72, fat: 20, fiber: 16, sugar: 14, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_chicken_tacos_pdf", name: "Chicken Tacos (3)", restaurant: "Chipotle", aliases: ["chicken tacos chipotle", "3 chicken tacos"], calories: 455, protein: 50, carbs: 43, fat: 14, fiber: 5, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_guac_side_pdf", name: "Side of Guacamole", restaurant: "Chipotle", aliases: ["side guacamole", "guac side"], calories: 230, protein: 2, carbs: 8, fat: 22, fiber: 6, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_chips_pdf", name: "Chips", restaurant: "Chipotle", aliases: ["chipotle chips", "chips only"], calories: 540, protein: 7, carbs: 73, fat: 25, fiber: 7, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_salad_chicken_pdf", name: "Chicken Salad", restaurant: "Chipotle", aliases: ["chicken salad chipotle", "chipotle chicken salad"], calories: 400, protein: 48, carbs: 18, fat: 16, fiber: 10, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_barbacoa_bowl_pdf", name: "Barbacoa Burrito Bowl", restaurant: "Chipotle", aliases: ["barbacoa bowl", "chipotle barbacoa bowl"], calories: 540, protein: 48, carbs: 67, fat: 22, fiber: 15, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_steak_bowl_pdf", name: "Steak Burrito Bowl", restaurant: "Chipotle", aliases: ["steak bowl", "chipotle steak bowl"], calories: 520, protein: 41, carbs: 67, fat: 20, fiber: 15, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_chicken_burrito_pdf", name: "Chicken Burrito", restaurant: "Chipotle", aliases: ["chicken burrito chipotle", "chipotle chicken burrito"], calories: 865, protein: 50, carbs: 117, fat: 28, fiber: 12, sugar: 9, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_barbacoa_burrito_pdf", name: "Barbacoa Burrito", restaurant: "Chipotle", aliases: ["barbacoa burrito", "chipotle barbacoa burrito"], calories: 855, protein: 48, carbs: 117, fat: 24, fiber: 12, sugar: 9, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_brown_rice_bowl_pdf", name: "Chicken Bowl (brown rice)", restaurant: "Chipotle", aliases: ["chicken bowl brown rice", "brown rice bowl chipotle"], calories: 550, protein: 50, carbs: 67, fat: 21, fiber: 16, sugar: 14, nutritionSource: "chipotle-us-nutrition-2025.pdf" },

  // McDonald's — additional (mcdonalds-nutrition-facts.pdf)
  { id: "mc_double_quarter_pdf", name: "Double Quarter Pounder with Cheese", restaurant: "McDonald's", aliases: ["double quarter pounder", "double quarter pounder with cheese"], calories: 780, protein: 50, carbs: 43, fat: 45, fiber: 3, sugar: 11, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_nuggets_20_pdf", name: "20 pc Chicken McNuggets", restaurant: "McDonald's", aliases: ["20 piece chicken mcnuggets", "20 pc nuggets", "chicken mcnuggets 20"], calories: 940, protein: 44, carbs: 59, fat: 59, fiber: 3, sugar: 0, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_buttermilk_crispy_pdf", name: "Buttermilk Crispy Chicken Sandwich", restaurant: "McDonald's", aliases: ["buttermilk crispy chicken", "crispy chicken sandwich mcdonalds"], calories: 580, protein: 24, carbs: 62, fat: 24, fiber: 4, sugar: 16, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_premium_sw_grilled_salad_pdf", name: "Premium Southwest Salad (Grilled Chicken)", restaurant: "McDonald's", aliases: ["southwest salad grilled chicken", "premium southwest salad"], calories: 330, protein: 33, carbs: 26, fat: 11, fiber: 6, sugar: 9, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_premium_asian_grilled_salad_pdf", name: "Premium Asian Salad (Grilled Chicken)", restaurant: "McDonald's", aliases: ["asian salad grilled chicken", "premium asian salad"], calories: 270, protein: 32, carbs: 18, fat: 9, fiber: 5, sugar: 10, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_sausage_egg_mcgriddles_pdf", name: "Sausage, Egg & Cheese McGriddles", restaurant: "McDonald's", aliases: ["sausage egg cheese mcgriddles", "sausage egg and cheese mcgriddles"], calories: 550, protein: 20, carbs: 48, fat: 31, fiber: 2, sugar: 9, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_sausage_mcgriddles_pdf", name: "Sausage McGriddles", restaurant: "McDonald's", aliases: ["sausage mcgriddles"], calories: 420, protein: 11, carbs: 43, fat: 22, fiber: 2, sugar: 8, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_big_breakfast_pdf", name: "Big Breakfast", restaurant: "McDonald's", aliases: ["big breakfast mcdonalds"], calories: 740, protein: 28, carbs: 51, fat: 48, fiber: 3, sugar: 3, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_double_cheeseburger_pdf", name: "Double Cheeseburger", restaurant: "McDonald's", aliases: ["double cheeseburger"], calories: 440, protein: 25, carbs: 35, fat: 22, fiber: 2, sugar: 8, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_snack_wrap_crispy_pdf", name: "Ranch Snack Wrap (Crispy)", restaurant: "McDonald's", aliases: ["ranch snack wrap crispy", "snack wrap crispy"], calories: 360, protein: 15, carbs: 32, fat: 20, fiber: 1, sugar: 5, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcwrap_ranch_crispy_pdf", name: "Premium McWrap Chicken & Ranch (Crispy)", restaurant: "McDonald's", aliases: ["mcwrap chicken ranch", "premium mcwrap crispy"], calories: 610, protein: 27, carbs: 56, fat: 31, fiber: 4, sugar: 15, nutritionSource: "mcdonalds-nutrition-facts.pdf" },

  // Taco Bell — additional (Taco-Bell.pdf)
  { id: "tb_bean_burrito_pdf", name: "Bean Burrito", restaurant: "Taco Bell", aliases: ["bean burrito", "taco bell bean burrito"], calories: 520, protein: 28, carbs: 41, fat: 25, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_burrito_supreme_beef_pdf", name: "Burrito Supreme (Beef)", restaurant: "Taco Bell", aliases: ["burrito supreme beef", "beef burrito supreme"], calories: 420, protein: 18, carbs: 52, fat: 15, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_burrito_supreme_chicken_pdf", name: "Burrito Supreme (Chicken)", restaurant: "Taco Bell", aliases: ["burrito supreme chicken"], calories: 330, protein: 19, carbs: 32, fat: 14, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_burrito_supreme_steak_pdf", name: "Burrito Supreme (Steak)", restaurant: "Taco Bell", aliases: ["burrito supreme steak"], calories: 550, protein: 20, carbs: 68, fat: 22, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_7_layer_pdf", name: "7-Layer Burrito", restaurant: "Taco Bell", aliases: ["7 layer burrito", "seven layer burrito"], calories: 660, protein: 24, carbs: 66, fat: 33, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_volcano_burrito_pdf", name: "Volcano Burrito", restaurant: "Taco Bell", aliases: ["volcano burrito"], calories: 780, protein: 24, carbs: 80, fat: 41, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_crunchwrap_supreme_pdf", name: "Crunchwrap Supreme", restaurant: "Taco Bell", aliases: ["crunchwrap supreme", "crunchwrap"], calories: 770, protein: 27, carbs: 73, fat: 42, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_chicken_burrito_pdf", name: "Chicken Burrito", restaurant: "Taco Bell", aliases: ["chicken burrito taco bell"], calories: 430, protein: 18, carbs: 48, fat: 16, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_soft_taco_supreme_beef_pdf", name: "Soft Taco Supreme (Beef)", restaurant: "Taco Bell", aliases: ["soft taco supreme beef", "taco supreme beef"], calories: 330, protein: 17, carbs: 29, fat: 14, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_crunchy_taco_supreme_pdf", name: "Crunchy Taco Supreme", restaurant: "Taco Bell", aliases: ["crunchy taco supreme"], calories: 370, protein: 13, carbs: 31, fat: 18, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_steak_quesadilla_pdf", name: "Steak Quesadilla", restaurant: "Taco Bell", aliases: ["steak quesadilla"], calories: 320, protein: 18, carbs: 38, fat: 11, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_chicken_quesadilla_alt_pdf", name: "Chicken Quesadilla (large)", restaurant: "Taco Bell", aliases: ["large chicken quesadilla"], calories: 480, protein: 19, carbs: 40, fat: 24, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_power_bowl_pdf", name: "Power Menu Bowl (Chicken)", restaurant: "Taco Bell", aliases: ["power menu bowl", "power bowl chicken", "cantina power bowl"], calories: 460, protein: 22, carbs: 41, fat: 24, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_volcano_nachos_pdf", name: "Volcano Nachos", restaurant: "Taco Bell", aliases: ["volcano nachos"], calories: 980, protein: 22, carbs: 88, fat: 61, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },

  // Subway — additional (subway.pdf)
  { id: "sw_titan_turkey_pdf", name: "6-inch #15 Titan Turkey", restaurant: "Subway", aliases: ["titan turkey", "6 inch titan turkey"], calories: 500, protein: 31, carbs: 42, fat: 23, fiber: 4, sugar: 3, nutritionSource: "subway.pdf" },
  { id: "sw_the_beast_pdf", name: "6-inch #30 The Beast", restaurant: "Subway", aliases: ["the beast sub", "6 inch the beast"], calories: 740, protein: 40, carbs: 47, fat: 44, fiber: 0, sugar: 0, nutritionSource: "subway.pdf" },
  { id: "sw_philly_pdf", name: "6-inch #1 The Philly", restaurant: "Subway", aliases: ["the philly", "6 inch philly cheesesteak"], calories: 510, protein: 28, carbs: 43, fat: 25, fiber: 4, sugar: 3, nutritionSource: "subway.pdf" },
  { id: "sw_garlic_roast_beef_pdf", name: "6-inch #17 Garlic Roast Beef", restaurant: "Subway", aliases: ["garlic roast beef sub"], calories: 490, protein: 30, carbs: 45, fat: 21, fiber: 0, sugar: 0, nutritionSource: "subway.pdf" },
  { id: "sw_rotisserie_pdf", name: "6-inch Rotisserie-Style Chicken", restaurant: "Subway", aliases: ["rotisserie chicken sub", "rotisserie style chicken"], calories: 310, protein: 24, carbs: 40, fat: 6, fiber: 6, sugar: 4, nutritionSource: "subway.pdf" },
  { id: "sw_cold_cut_pdf", name: "6-inch Cold Cut Combo", restaurant: "Subway", aliases: ["cold cut combo", "cold cut combo sub"], calories: 330, protein: 17, carbs: 43, fat: 10, fiber: 5, sugar: 3, nutritionSource: "subway.pdf" },
  { id: "sw_roast_beef_pdf", name: "6-inch Roast Beef", restaurant: "Subway", aliases: ["6 inch roast beef", "roast beef sub"], calories: 300, protein: 25, carbs: 42, fat: 4, fiber: 7, sugar: 5, nutritionSource: "subway.pdf" },
  { id: "sw_footlong_bmt_pdf", name: "Footlong Ultimate B.M.T.", restaurant: "Subway", aliases: ["footlong bmt", "footlong ultimate bmt"], calories: 1120, protein: 54, carbs: 90, fat: 60, fiber: 0, sugar: 0, nutritionSource: "subway.pdf" },
  { id: "sw_footlong_meatball_pdf", name: "Footlong Meatball Marinara", restaurant: "Subway", aliases: ["footlong meatball", "meatball footlong"], calories: 920, protein: 40, carbs: 104, fat: 40, fiber: 8, sugar: 6, nutritionSource: "subway.pdf" },
  { id: "sw_club_pdf", name: "6-inch All-American Club", restaurant: "Subway", aliases: ["all american club", "subway club"], calories: 540, protein: 27, carbs: 45, fat: 28, fiber: 0, sugar: 0, nutritionSource: "subway.pdf" },
  { id: "sw_honey_mustard_chicken_pdf", name: "6-inch Honey Mustard BBQ Chicken", restaurant: "Subway", aliases: ["honey mustard bbq chicken", "honey mustard chicken sub"], calories: 510, protein: 30, carbs: 53, fat: 20, fiber: 4, sugar: 3, nutritionSource: "subway.pdf" },

  // Wendy's — additional (wendy's.pdf)
  { id: "wen_daves_double_pdf", name: "Dave's Double", restaurant: "Wendy's", aliases: ["daves double", "dave double"], calories: 879, protein: 54, carbs: 39, fat: 56, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_daves_triple_pdf", name: "Dave's Triple", restaurant: "Wendy's", aliases: ["daves triple"], calories: 1195, protein: 77, carbs: 41, fat: 80, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_classic_chicken_pdf", name: "Classic Chicken Sandwich", restaurant: "Wendy's", aliases: ["classic chicken sandwich", "wendys classic chicken"], calories: 404, protein: 20, carbs: 46, fat: 15, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_grilled_chicken_pdf", name: "Grilled Chicken Sandwich", restaurant: "Wendy's", aliases: ["grilled chicken sandwich wendys", "wendys grilled chicken"], calories: 337, protein: 26, carbs: 35, fat: 10, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_avocado_club_pdf", name: "Avocado Chicken Club", restaurant: "Wendy's", aliases: ["avocado chicken club", "wendys avocado club"], calories: 583, protein: 30, carbs: 47, fat: 30, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_nuggets_10_pdf", name: "10 pc Chicken Nuggets", restaurant: "Wendy's", aliases: ["10 piece nuggets wendys", "wendys 10 pc nuggets"], calories: 286, protein: 28, carbs: 12, fat: 14, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_nuggets_6_pdf", name: "6 pc Chicken Nuggets", restaurant: "Wendy's", aliases: ["6 piece nuggets wendys"], calories: 173, protein: 17, carbs: 7, fat: 8, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_large_fries_pdf", name: "Large Fries", restaurant: "Wendy's", aliases: ["large fries wendys", "wendys large fries"], calories: 239, protein: 3, carbs: 31, fat: 11, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_value_fries_pdf", name: "Value Fries", restaurant: "Wendy's", aliases: ["value fries", "small fries wendys"], calories: 142, protein: 2, carbs: 18, fat: 7, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_regular_frosty_pdf", name: "Regular Chocolate Frosty", restaurant: "Wendy's", aliases: ["regular chocolate frosty", "frosty regular"], calories: 299, protein: 9, carbs: 48, fat: 8, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_bacon_cheeseburger_pdf", name: "Bacon Cheeseburger", restaurant: "Wendy's", aliases: ["bacon cheeseburger wendys"], calories: 410, protein: 20, carbs: 30, fat: 23, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },
  { id: "wen_caesar_salad_pdf", name: "Caesar Chicken Salad", restaurant: "Wendy's", aliases: ["caesar chicken salad wendys"], calories: 411, protein: 28, carbs: 4, fat: 31, fiber: 0, sugar: 0, nutritionSource: "wendy's.pdf" },

  // Burger King — additional
  { id: "bk_cheeseburger", name: "Cheeseburger", restaurant: "Burger King", aliases: ["bk cheeseburger", "burger king cheeseburger"], calories: 290, protein: 15, carbs: 30, fat: 13, fiber: 1, sugar: 7, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_bacon_cheeseburger", name: "Bacon Cheeseburger", restaurant: "Burger King", aliases: ["bk bacon cheeseburger"], calories: 340, protein: 18, carbs: 30, fat: 16, fiber: 1, sugar: 7, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_spicy_crispy_chicken", name: "Spicy Royal Crispy Chicken Sandwich", restaurant: "Burger King", aliases: ["spicy crispy chicken bk", "spicy royal crispy chicken"], calories: 760, protein: 31, carbs: 58, fat: 47, fiber: 9, sugar: 11, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_original_chicken", name: "Original Chicken Sandwich", restaurant: "Burger King", aliases: ["original chicken sandwich bk"], calories: 680, protein: 23, carbs: 63, fat: 39, fiber: 3, sugar: 7, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_onion_rings_medium", name: "Onion Rings (Medium)", restaurant: "Burger King", aliases: ["onion rings medium", "bk onion rings"], calories: 360, protein: 4, carbs: 48, fat: 16, fiber: 5, sugar: 5, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_hash_browns_medium", name: "Hash Browns (Medium)", restaurant: "Burger King", aliases: ["bk hash browns", "hash browns medium"], calories: 540, protein: 4, carbs: 54, fat: 34, fiber: 5, sugar: 0, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_fries_large", name: "Large French Fries", restaurant: "Burger King", aliases: ["bk large fries", "large fries burger king"], calories: 440, protein: 5, carbs: 64, fat: 19, fiber: 5, sugar: 1, nutritionSource: "burger-king-nutrition.pdf" },

  // Five Guys — additional
  { id: "fg_bacon_dog", name: "Bacon Dog", restaurant: "Five Guys", aliases: ["bacon dog five guys", "bacon hot dog"], calories: 560, protein: 22, carbs: 41, fat: 32, fiber: 2, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_cajun_little_fries", name: "Little Cajun Fries", restaurant: "Five Guys", aliases: ["cajun fries little", "little cajun fries"], calories: 540, protein: 8, carbs: 75, fat: 28, fiber: 8, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },
  { id: "fg_large_fries", name: "Large Fries", restaurant: "Five Guys", aliases: ["large fries five guys"], calories: 1314, protein: 20, carbs: 181, fat: 57, fiber: 21, sugar: 0, nutritionSource: "five-guys-nutrition.pdf" },

  // Starbucks — additional
  { id: "sb_cappuccino_grande_pdf", name: "Caffè Cappuccino (Grande, whole milk)", restaurant: "Starbucks", aliases: ["cappuccino grande", "caffe cappuccino grande"], calories: 140, protein: 7, carbs: 12, fat: 7, fiber: 0, sugar: 12, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_mocha_grande_pdf", name: "Caffè Mocha (Grande, whole milk)", restaurant: "Starbucks", aliases: ["mocha grande", "caffe mocha grande"], calories: 400, protein: 13, carbs: 44, fat: 19, fiber: 1, sugar: 35, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_americano_grande_pdf", name: "Caffè Americano (Grande)", restaurant: "Starbucks", aliases: ["americano grande", "caffe americano grande"], calories: 15, protein: 1, carbs: 3, fat: 0, fiber: 0, sugar: 0, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_sausage_egg_cheddar_pdf", name: "Sausage, Egg & Cheddar Breakfast Sandwich", restaurant: "Starbucks", aliases: ["sausage egg cheddar sandwich", "sausage egg and cheese starbucks"], calories: 480, protein: 18, carbs: 34, fat: 29, fiber: 1, sugar: 2, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_double_smoked_bacon_pdf", name: "Double Smoked Bacon Breakfast Sandwich", restaurant: "Starbucks", aliases: ["double smoked bacon sandwich", "bacon breakfast sandwich starbucks"], calories: 500, protein: 21, carbs: 43, fat: 27, fiber: 2, sugar: 8, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_egg_bites_bacon_pdf", name: "Bacon & Gruyere Egg Bites", restaurant: "Starbucks", aliases: ["bacon gruyere egg bites", "egg bites bacon"], calories: 300, protein: 19, carbs: 9, fat: 20, fiber: 0, sugar: 2, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_turkey_bacon_sandwich_pdf", name: "Reduced-Fat Turkey Bacon Sandwich", restaurant: "Starbucks", aliases: ["turkey bacon sandwich starbucks", "reduced fat turkey bacon"], calories: 230, protein: 17, carbs: 28, fat: 5, fiber: 3, sugar: 2, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_butter_croissant_pdf", name: "Butter Croissant", restaurant: "Starbucks", aliases: ["butter croissant starbucks"], calories: 250, protein: 5, carbs: 26, fat: 14, fiber: 1, sugar: 4, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_chocolate_chip_cookie_pdf", name: "Chocolate Chip Cookie", restaurant: "Starbucks", aliases: ["chocolate chip cookie starbucks"], calories: 360, protein: 6, carbs: 47, fat: 18, fiber: 2, sugar: 31, nutritionSource: "Starbucks-food.pdf" },

  // Domino's — additional
  { id: "dz_medium_pepperoni_slice_pdf", name: "Medium Hand Tossed Pepperoni (1/8 pizza)", restaurant: "Domino's", aliases: ["medium pepperoni pizza slice", "pepperoni pizza medium dominos"], calories: 110, protein: 4, carbs: 21, fat: 2, fiber: 1, sugar: 0, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_medium_cheese_slice_pdf", name: "Medium Hand Tossed Cheese (1/8 pizza)", restaurant: "Domino's", aliases: ["medium cheese pizza slice", "cheese pizza medium dominos"], calories: 110, protein: 4, carbs: 21, fat: 2, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_specialty_small_pdf", name: "Specialty Pizza Small (1/4 pizza)", restaurant: "Domino's", aliases: ["specialty pizza small dominos", "meat feast small slice"], calories: 360, protein: 14, carbs: 38, fat: 16, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_specialty_medium_pdf", name: "Specialty Pizza Medium (1/5 pizza)", restaurant: "Domino's", aliases: ["specialty pizza medium dominos"], calories: 390, protein: 19, carbs: 38, fat: 19, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_garlic_bread_twist_pdf", name: "Garlic Bread Twists (8 piece)", restaurant: "Domino's", aliases: ["garlic bread twists", "bread twists dominos"], calories: 220, protein: 7, carbs: 40, fat: 3, fiber: 1, sugar: 0, nutritionSource: "DominosNutritionGuide.pdf" },

  // Dave's Hot Chicken — additional
  { id: "dhc_mac_cheese_pdf", name: "Mac & Cheese", restaurant: "Dave's Hot Chicken", aliases: ["mac and cheese daves", "dhc mac cheese"], calories: 421, protein: 15, carbs: 38, fat: 22, fiber: 1, sugar: 2, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  { id: "dhc_bites_pdf", name: "Dave's Bites", restaurant: "Dave's Hot Chicken", aliases: ["daves bites", "dave's bites"], calories: 601, protein: 39, carbs: 40, fat: 32, fiber: 2, sugar: 8, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },
  { id: "dhc_daves_1_pdf", name: "Dave's #1 (Mild)", restaurant: "Dave's Hot Chicken", aliases: ["daves 1", "dave's #1"], calories: 1418, protein: 67, carbs: 139, fat: 64, fiber: 5, sugar: 11, nutritionSource: "Daves_Hot_Chicken_Menu_Nutrition_Guide.pdf" },

  // McDonald's — more popular items
  { id: "mc_bacon_clubhouse_pdf", name: "Bacon Clubhouse Burger", restaurant: "McDonald's", aliases: ["bacon clubhouse burger", "clubhouse burger"], calories: 740, protein: 40, carbs: 51, fat: 41, fiber: 4, sugar: 14, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_bacon_clubhouse_grilled_pdf", name: "Bacon Clubhouse Grilled Chicken Sandwich", restaurant: "McDonald's", aliases: ["bacon clubhouse grilled chicken", "clubhouse grilled chicken"], calories: 610, protein: 45, carbs: 50, fat: 26, fiber: 3, sugar: 14, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_mcwrap_sweet_chili_grilled_pdf", name: "Premium McWrap Chicken Sweet Chili (Grilled)", restaurant: "McDonald's", aliases: ["mcwrap sweet chili grilled", "sweet chili mcwrap grilled"], calories: 400, protein: 31, carbs: 46, fat: 10, fiber: 3, sugar: 13, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_bacon_egg_biscuit_pdf", name: "Bacon, Egg & Cheese Biscuit", restaurant: "McDonald's", aliases: ["bacon egg cheese biscuit", "bacon egg and cheese biscuit"], calories: 460, protein: 20, carbs: 36, fat: 26, fiber: 2, sugar: 3, nutritionSource: "mcdonalds-nutrition-facts.pdf" },
  { id: "mc_premium_bacon_ranch_crispy_salad_pdf", name: "Premium Bacon Ranch Salad (Crispy Chicken)", restaurant: "McDonald's", aliases: ["bacon ranch salad crispy", "premium bacon ranch salad"], calories: 450, protein: 30, carbs: 23, fat: 26, fiber: 3, sugar: 12, nutritionSource: "mcdonalds-nutrition-facts.pdf" },

  // Taco Bell — burritos, chalupas, specialties (Taco-Bell.pdf)
  { id: "tb_grilled_stuft_beef_pdf", name: "Grilled Stuft Burrito (Beef)", restaurant: "Taco Bell", aliases: ["grilled stuft burrito beef", "stuft burrito beef"], calories: 540, protein: 21, carbs: 46, fat: 30, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_grilled_stuft_chicken_pdf", name: "Grilled Stuft Burrito (Chicken)", restaurant: "Taco Bell", aliases: ["grilled stuft burrito chicken", "stuft burrito chicken"], calories: 910, protein: 34, carbs: 70, fat: 55, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_beefy_5layer_pdf", name: "Beefy 5-Layer Burrito", restaurant: "Taco Bell", aliases: ["beefy 5 layer burrito", "beefy five layer"], calories: 490, protein: 18, carbs: 62, fat: 19, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_chalupa_supreme_beef_pdf", name: "Chalupa Supreme (Beef)", restaurant: "Taco Bell", aliases: ["chalupa supreme beef"], calories: 350, protein: 14, carbs: 30, fat: 20, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_cheese_quesadilla_pdf", name: "Cheese Quesadilla", restaurant: "Taco Bell", aliases: ["cheese quesadilla taco bell"], calories: 480, protein: 19, carbs: 40, fat: 27, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_chili_cheese_burrito_pdf", name: "Chili Cheese Burrito", restaurant: "Taco Bell", aliases: ["chili cheese burrito"], calories: 380, protein: 16, carbs: 41, fat: 17, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_double_decker_taco_pdf", name: "Double Decker Taco", restaurant: "Taco Bell", aliases: ["double decker taco"], calories: 350, protein: 14, carbs: 39, fat: 15, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },
  { id: "tb_fiesta_taco_salad_pdf", name: "Fiesta Taco Salad", restaurant: "Taco Bell", aliases: ["fiesta taco salad"], calories: 770, protein: 20, carbs: 78, fat: 42, fiber: 0, sugar: 0, nutritionSource: "Taco-Bell.pdf" },

  // Subway — series & footlongs
  { id: "sw_homerun_ham_pdf", name: "6-inch #99 Homerun Ham", restaurant: "Subway", aliases: ["homerun ham", "6 inch homerun ham"], calories: 510, protein: 28, carbs: 45, fat: 24, fiber: 4, sugar: 3, nutritionSource: "subway.pdf" },
  { id: "sw_outlaw_pdf", name: "6-inch #2 The Outlaw", restaurant: "Subway", aliases: ["the outlaw sub", "6 inch outlaw"], calories: 490, protein: 31, carbs: 42, fat: 22, fiber: 0, sugar: 0, nutritionSource: "subway.pdf" },
  { id: "sw_cheesy_garlic_steak_pdf", name: "6-inch #31 Cheesy Garlic Steak", restaurant: "Subway", aliases: ["cheesy garlic steak", "garlic steak sub"], calories: 510, protein: 28, carbs: 43, fat: 23, fiber: 4, sugar: 3, nutritionSource: "subway.pdf" },
  { id: "sw_footlong_steak_cheese_pdf", name: "Footlong Steak & Cheese", restaurant: "Subway", aliases: ["footlong steak and cheese", "steak and cheese footlong"], calories: 740, protein: 52, carbs: 84, fat: 20, fiber: 10, sugar: 8, nutritionSource: "subway.pdf" },
  { id: "sw_footlong_ham_pdf", name: "Footlong Black Forest Ham", restaurant: "Subway", aliases: ["footlong ham", "black forest ham footlong"], calories: 560, protein: 38, carbs: 84, fat: 10, fiber: 14, sugar: 0, nutritionSource: "subway.pdf" },

  // Burger King — Whopper family
  { id: "bk_whopper_jr_pdf", name: "WHOPPER JR. Sandwich", restaurant: "Burger King", aliases: ["whopper jr", "whopper junior"], calories: 330, protein: 15, carbs: 30, fat: 18, fiber: 2, sugar: 7, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_double_whopper_pdf", name: "DOUBLE WHOPPER Sandwich", restaurant: "Burger King", aliases: ["double whopper"], calories: 920, protein: 52, carbs: 54, fat: 58, fiber: 3, sugar: 13, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_bacon_cheese_whopper_pdf", name: "Bacon & Cheese WHOPPER", restaurant: "Burger King", aliases: ["bacon and cheese whopper", "bacon cheese whopper"], calories: 820, protein: 40, carbs: 56, fat: 51, fiber: 3, sugar: 14, nutritionSource: "burger-king-nutrition.pdf" },
  { id: "bk_sausage_egg_biscuit_pdf", name: "Sausage, Egg & Cheese Biscuit", restaurant: "Burger King", aliases: ["sausage egg cheese biscuit bk"], calories: 550, protein: 20, carbs: 32, fat: 39, fiber: 1, sugar: 0, nutritionSource: "burger-king-nutrition.pdf" },

  // Chipotle — more builds
  { id: "chip_carnitas_burrito_pdf", name: "Carnitas Burrito", restaurant: "Chipotle", aliases: ["carnitas burrito", "chipotle carnitas burrito"], calories: 900, protein: 35, carbs: 117, fat: 28, fiber: 12, sugar: 9, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_sofritas_burrito_pdf", name: "Sofritas Burrito", restaurant: "Chipotle", aliases: ["sofritas burrito"], calories: 935, protein: 22, carbs: 117, fat: 24, fiber: 16, sugar: 14, nutritionSource: "chipotle-us-nutrition-2025.pdf" },
  { id: "chip_corn_salsa_side_pdf", name: "Roasted Chili-Corn Salsa (side)", restaurant: "Chipotle", aliases: ["corn salsa chipotle", "roasted chili corn salsa"], calories: 80, protein: 3, carbs: 16, fat: 1, fiber: 3, sugar: 0, nutritionSource: "chipotle-us-nutrition-2025.pdf" },

  // Starbucks — more food & drinks
  { id: "sb_caramel_macchiato_grande_pdf", name: "Caramel Macchiato (Grande, whole milk)", restaurant: "Starbucks", aliases: ["caramel macchiato grande"], calories: 250, protein: 10, carbs: 35, fat: 7, fiber: 0, sugar: 33, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_iced_latte_grande_pdf", name: "Iced Caffè Latte (Grande, whole milk)", restaurant: "Starbucks", aliases: ["iced latte grande", "iced caffe latte grande"], calories: 150, protein: 8, carbs: 13, fat: 7, fiber: 0, sugar: 0, nutritionSource: "Starbucks-beverages.pdf" },
  { id: "sb_banana_nut_bread_pdf", name: "Banana Nut Bread", restaurant: "Starbucks", aliases: ["banana nut bread starbucks"], calories: 410, protein: 6, carbs: 50, fat: 20, fiber: 2, sugar: 28, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_almond_croissant_pdf", name: "Almond Croissant", restaurant: "Starbucks", aliases: ["almond croissant starbucks"], calories: 420, protein: 9, carbs: 40, fat: 25, fiber: 1, sugar: 14, nutritionSource: "Starbucks-food.pdf" },
  { id: "sb_kale_egg_bites_pdf", name: "Kale & Mushroom Egg Bites", restaurant: "Starbucks", aliases: ["kale mushroom egg bites", "egg bites kale"], calories: 230, protein: 15, carbs: 11, fat: 14, fiber: 2, sugar: 1, nutritionSource: "Starbucks-food.pdf" },

  // Domino's — large pizza slice
  { id: "dz_large_pepperoni_slice_pdf", name: "Large Hand Tossed Pepperoni (1/8 pizza)", restaurant: "Domino's", aliases: ["large pepperoni pizza slice", "pepperoni pizza large dominos"], calories: 160, protein: 7, carbs: 30, fat: 2, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },
  { id: "dz_medium_pan_slice_pdf", name: "Medium Pan Pizza (1/8 pizza)", restaurant: "Domino's", aliases: ["pan pizza slice medium", "medium pan pizza dominos"], calories: 190, protein: 5, carbs: 26, fat: 7, fiber: 1, sugar: 2, nutritionSource: "DominosNutritionGuide.pdf" },

  // Five Guys — hot dog
  { id: "fg_plain_dog", name: "Hot Dog", restaurant: "Five Guys", aliases: ["five guys hot dog", "hot dog five guys"], calories: 545, protein: 18, carbs: 40, fat: 32, fiber: 2, sugar: 8, nutritionSource: "five-guys-nutrition.pdf" }
];
