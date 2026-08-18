import type { MenuItem, MenuSection, Restaurant } from "@/lib/types";

const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const FOOD = {
  jollof: UNSPLASH("1604908176997-125f25cc6f3d"),
  suya: UNSPLASH("1529193591184-b1d58069ecdd"),
  bukka: UNSPLASH("1512058564366-18510be2db19"),
  shawarma: UNSPLASH("1529006557810-274b9b2fc783"),
  pizza: UNSPLASH("1513104890138-7c749659a591"),
  salad: UNSPLASH("1512621776951-a57141f2eefd"),
  dessert: UNSPLASH("1551024506-0bccd828d307"),
  amala: UNSPLASH("1567620905732-2d1ec7ab7445"),
  burger: UNSPLASH("1568901346375-23c9450c58cd"),
  riceBowl: UNSPLASH("1547592180-85f173990554"),
  soup: UNSPLASH("1547592166-23ac45744acd"),
  drink: UNSPLASH("1544145945-f90425340c7e"),
  plantain: UNSPLASH("1598866594230-a7c12756260f"),
  water: UNSPLASH("1523362628745-0c100150b504"),
};

/** Compact menu spec — expanded into ids at module load. */
type ItemSpec = [name: string, description: string, price: number, image: string];

function section(
  restaurantSlug: string,
  index: number,
  name: string,
  specs: ItemSpec[],
): MenuSection {
  const id = `section-${index}`;
  return {
    id,
    name,
    items: specs.map(([itemName, description, price, image], i) => ({
      id: `${restaurantSlug}-${index}-${i}`,
      name: itemName,
      description,
      price,
      image,
    })),
  };
}

function pairing(
  restaurantSlug: string,
  i: number,
  name: string,
  price: number,
  image: string,
): MenuItem {
  return {
    id: `${restaurantSlug}-pairing-${i}`,
    name,
    description: "",
    price,
    image,
  };
}

const mamaCassMenu: MenuSection[] = [
  section("mama-cass-kitchen", 0, "Popular", [
    [
      "Jollof Rice & Chicken",
      "Smoky party jollof with grilled chicken and fried plantain",
      3200,
      FOOD.jollof,
    ],
    ["Fried Rice Combo", "Nigerian fried rice with beef and coleslaw", 3000, FOOD.riceBowl],
    [
      "Ofada Rice & Sauce",
      "Local rice with spicy ofada sauce and assorted meat",
      3500,
      FOOD.jollof,
    ],
  ]),
  section("mama-cass-kitchen", 1, "Soups & Swallow", [
    [
      "Egusi Soup & Pounded Yam",
      "Melon seed soup with assorted meat and fish",
      3800,
      FOOD.soup,
    ],
    ["Efo Riro & Semo", "Vegetable soup with smoked fish and semovita", 3600, FOOD.amala],
    ["Pepper Soup", "Spicy goat meat pepper soup, served hot", 2800, FOOD.soup],
  ]),
  section("mama-cass-kitchen", 2, "Drinks", [
    ["Chapman", "Classic Nigerian mocktail, chilled", 1500, FOOD.drink],
    ["Zobo Drink", "Hibiscus drink with ginger and pineapple", 1000, FOOD.drink],
    ["Bottled Water", "50cl chilled water", 300, FOOD.water],
  ]),
];

const mamaCassPairings: MenuItem[] = [
  pairing("mama-cass-kitchen", 0, "Fried Plantain", 800, FOOD.plantain),
  pairing("mama-cass-kitchen", 1, "Moin Moin", 1000, FOOD.jollof),
  pairing("mama-cass-kitchen", 2, "Chapman", 1500, FOOD.drink),
  pairing("mama-cass-kitchen", 3, "Coleslaw", 700, FOOD.salad),
];

/** Restaurants without a hand-authored menu get a plausible one so every card
 *  in the listing leads somewhere real. */
function genericMenu(slug: string, headline: ItemSpec[], image: string): MenuSection[] {
  return [
    section(slug, 0, "Popular", headline),
    section(slug, 1, "Sides", [
      ["Fried Plantain", "Sweet ripe plantain, fried golden", 800, FOOD.plantain],
      ["Coleslaw", "Crisp cabbage and carrot in creamy dressing", 700, FOOD.salad],
      ["Extra Protein", "Choice of chicken, beef or fish", 1200, image],
    ]),
    section(slug, 2, "Drinks", [
      ["Chapman", "Classic Nigerian mocktail, chilled", 1500, FOOD.drink],
      ["Bottled Water", "50cl chilled water", 300, FOOD.water],
    ]),
  ];
}

function genericPairings(slug: string): MenuItem[] {
  return [
    pairing(slug, 0, "Fried Plantain", 800, FOOD.plantain),
    pairing(slug, 1, "Chapman", 1500, FOOD.drink),
    pairing(slug, 2, "Coleslaw", 700, FOOD.salad),
    pairing(slug, 3, "Bottled Water", 300, FOOD.water),
  ];
}

export const restaurants: Restaurant[] = [
  {
    slug: "mama-cass-kitchen",
    name: "Mama Cass Kitchen",
    cuisine: "Nigerian · Rice dishes",
    cuisineKey: "Nigerian",
    rating: 4.8,
    reviewCount: "2.3k",
    deliveryTime: "15-25 min",
    deliveryFee: 500,
    minimumOrder: 1500,
    openHours: "9:00 AM – 10:00 PM",
    opensAt: 9,
    closesAt: 22,
    pickup: true,
    address: "12 Admiralty Way, Lekki",
    promo: "20% OFF",
    priceLevel: "₦₦",
    image: FOOD.jollof,
    cover: FOOD.jollof,
    menu: mamaCassMenu,
    pairings: mamaCassPairings,
  },
  {
    slug: "suya-republic",
    name: "Suya Republic",
    cuisine: "Grills · Suya",
    cuisineKey: "Grills",
    rating: 4.7,
    reviewCount: "1.8k",
    deliveryTime: "20-30 min",
    deliveryFee: 700,
    minimumOrder: 2000,
    openHours: "12:00 PM – 11:00 PM",
    opensAt: 12,
    closesAt: 23,
    pickup: true,
    address: "5 Awolowo Road, Ikoyi",
    priceLevel: "₦₦",
    image: FOOD.suya,
    cover: FOOD.suya,
    menu: genericMenu(
      "suya-republic",
      [
        ["Beef Suya Platter", "Spiced beef skewers with onions and yaji", 2800, FOOD.suya],
        ["Chicken Suya", "Grilled chicken skewers, extra peppery", 3000, FOOD.suya],
        ["Ram Suya", "Tender ram cuts grilled over open flame", 3600, FOOD.suya],
      ],
      FOOD.suya,
    ),
    pairings: genericPairings("suya-republic"),
  },
  {
    slug: "bukka-hut",
    name: "Bukka Hut",
    cuisine: "Local · Swallow",
    cuisineKey: "Local",
    rating: 4.9,
    reviewCount: "3.1k",
    deliveryTime: "10-20 min",
    deliveryFee: 0,
    minimumOrder: 1500,
    openHours: "8:00 AM – 9:00 PM",
    opensAt: 8,
    closesAt: 21,
    pickup: true,
    address: "22 Opebi Road, Ikeja",
    priceLevel: "₦",
    image: FOOD.bukka,
    cover: FOOD.bukka,
    menu: genericMenu(
      "bukka-hut",
      [
        ["Amala & Ewedu", "Soft amala with ewedu and gbegiri", 2500, FOOD.amala],
        ["Eba & Egusi", "Garri swallow with rich egusi soup", 2700, FOOD.soup],
        ["Ofada & Ayamase", "Ofada rice with designer stew", 3100, FOOD.jollof],
      ],
      FOOD.bukka,
    ),
    pairings: genericPairings("bukka-hut"),
  },
  {
    slug: "shawarma-spot",
    name: "Shawarma Spot",
    cuisine: "Middle Eastern",
    cuisineKey: "Middle",
    rating: 4.6,
    reviewCount: "1.2k",
    deliveryTime: "15-25 min",
    deliveryFee: 400,
    minimumOrder: 1000,
    openHours: "11:00 AM – 12:00 AM",
    opensAt: 11,
    closesAt: 0,
    pickup: true,
    address: "8 Admiralty Way, Lekki",
    priceLevel: "₦₦",
    image: FOOD.shawarma,
    cover: FOOD.shawarma,
    menu: genericMenu(
      "shawarma-spot",
      [
        ["Chicken Shawarma", "Grilled chicken, garlic sauce, soft pita", 2600, FOOD.shawarma],
        ["Beef Shawarma", "Spiced beef with pickles and chilli", 3000, FOOD.shawarma],
        ["Double Sausage Shawarma", "Chicken and beef with two sausages", 3600, FOOD.shawarma],
      ],
      FOOD.shawarma,
    ),
    pairings: genericPairings("shawarma-spot"),
  },
  {
    slug: "pizza-yard",
    name: "Pizza Yard",
    cuisine: "Pizza · Italian",
    cuisineKey: "Pizza",
    rating: 4.7,
    reviewCount: "980",
    deliveryTime: "25-35 min",
    deliveryFee: 600,
    minimumOrder: 3000,
    openHours: "11:00 AM – 11:00 PM",
    opensAt: 11,
    closesAt: 23,
    pickup: false,
    address: "14 Adeola Odeku, Victoria Island",
    promo: "New",
    priceLevel: "₦₦₦",
    image: FOOD.pizza,
    cover: FOOD.pizza,
    menu: genericMenu(
      "pizza-yard",
      [
        ["Pepperoni Classic", "Mozzarella, pepperoni, house tomato base", 4200, FOOD.pizza],
        ["BBQ Chicken", "Smoky barbecue chicken with red onion", 4600, FOOD.pizza],
        ["Suya Pizza", "Yaji-spiced beef, onions, green pepper", 4800, FOOD.pizza],
      ],
      FOOD.pizza,
    ),
    pairings: genericPairings("pizza-yard"),
  },
  {
    slug: "green-bowl",
    name: "Green Bowl",
    cuisine: "Healthy · Salads",
    cuisineKey: "Healthy",
    rating: 4.5,
    reviewCount: "640",
    deliveryTime: "20-30 min",
    deliveryFee: 500,
    minimumOrder: 2000,
    openHours: "8:00 AM – 8:00 PM",
    opensAt: 8,
    closesAt: 20,
    pickup: false,
    address: "3 Kofo Abayomi, Victoria Island",
    priceLevel: "₦₦",
    image: FOOD.salad,
    cover: FOOD.salad,
    menu: genericMenu(
      "green-bowl",
      [
        ["Grilled Chicken Bowl", "Quinoa, greens, avocado, grilled chicken", 3100, FOOD.salad],
        ["Salmon Poke Bowl", "Sushi rice, salmon, edamame, sesame", 4500, FOOD.salad],
        ["Vegan Buddha Bowl", "Roast veg, chickpeas, tahini dressing", 2900, FOOD.salad],
      ],
      FOOD.salad,
    ),
    pairings: genericPairings("green-bowl"),
  },
  {
    slug: "sweet-tooth",
    name: "Sweet Tooth",
    cuisine: "Desserts · Bakery",
    cuisineKey: "Desserts",
    rating: 4.8,
    reviewCount: "1.5k",
    deliveryTime: "15-20 min",
    deliveryFee: 0,
    minimumOrder: 1000,
    openHours: "9:00 AM – 9:00 PM",
    opensAt: 9,
    closesAt: 21,
    pickup: true,
    address: "18 Isaac John, Ikeja GRA",
    priceLevel: "₦",
    image: FOOD.dessert,
    cover: FOOD.dessert,
    menu: genericMenu(
      "sweet-tooth",
      [
        ["Red Velvet Slice", "Cream cheese frosting, baked fresh daily", 2200, FOOD.dessert],
        ["Puff Puff (6pc)", "Golden Nigerian doughnuts, lightly sweet", 1200, FOOD.dessert],
        ["Chin Chin Cup", "Crunchy fried dough, nutmeg spiced", 900, FOOD.dessert],
      ],
      FOOD.dessert,
    ),
    pairings: genericPairings("sweet-tooth"),
  },
  {
    slug: "amala-palace",
    name: "Amala Palace",
    cuisine: "Nigerian · Swallow",
    cuisineKey: "Nigerian",
    rating: 4.6,
    reviewCount: "870",
    deliveryTime: "20-25 min",
    deliveryFee: 450,
    minimumOrder: 1500,
    openHours: "8:00 AM – 10:00 PM",
    opensAt: 8,
    closesAt: 22,
    pickup: true,
    address: "9 Allen Avenue, Ikeja",
    priceLevel: "₦",
    image: FOOD.amala,
    cover: FOOD.amala,
    menu: genericMenu(
      "amala-palace",
      [
        ["Amala & Gbegiri", "Classic combo with assorted meat", 2900, FOOD.amala],
        ["Pounded Yam & Egusi", "Smooth pounded yam, rich egusi", 3300, FOOD.soup],
        ["Semo & Efo Riro", "Semovita with vegetable soup", 3000, FOOD.amala],
      ],
      FOOD.amala,
    ),
    pairings: genericPairings("amala-palace"),
  },
  {
    slug: "burger-barn",
    name: "Burger Barn",
    cuisine: "Fast food · Burgers",
    cuisineKey: "Fast",
    rating: 4.4,
    reviewCount: "1.1k",
    deliveryTime: "15-25 min",
    deliveryFee: 500,
    minimumOrder: 2000,
    openHours: "10:00 AM – 11:00 PM",
    opensAt: 10,
    closesAt: 23,
    pickup: true,
    address: "27 Ozumba Mbadiwe, Victoria Island",
    priceLevel: "₦₦",
    image: FOOD.burger,
    cover: FOOD.burger,
    menu: genericMenu(
      "burger-barn",
      [
        ["Double Beef Burger", "Two patties, cheddar, house sauce", 3400, FOOD.burger],
        ["Crispy Chicken Burger", "Buttermilk chicken, slaw, pickles", 3100, FOOD.burger],
        ["Loaded Fries", "Fries with cheese sauce and beef", 2400, FOOD.burger],
      ],
      FOOD.burger,
    ),
    pairings: genericPairings("burger-barn"),
  },
];
