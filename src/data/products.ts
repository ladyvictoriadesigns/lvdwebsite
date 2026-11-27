export type ProductAvailability = "pre-sale" | "available";

export interface Product {
  slug: string;
  name: string;
  /** Price in USD. */
  price: number;
  availability: ProductAvailability;
  /** Deposit due today for pre-sale pieces, in USD. The balance is due on arrival. */
  deposit?: number;
  size?: string;
  details: string[];
  description: string;
  image: string;
  imageAlt: string;
  /** Where the grid crop sits on the cover photo (CSS object-position). Default: center. */
  imagePosition?: string;
  /** Plain product photo shown when you point at a grid card. Default: the first gallery photo. */
  hoverImage?: string;
  paymentLink: string;
  gallery?: string[];
}

export const PRE_SALE_PRODUCTS: Product[] = [
  {
    slug: "fisher-pedestal-bowl-white",
    paymentLink: "https://buy.stripe.com/dRmaEXg6Sdd57sD9Es4sE00",
    name: "Fisher Pedestal Bowl, White",
    price: 59.99,
    availability: "pre-sale",
    deposit: 30.0,
    size: "25 × 25 cm (about 10 × 10 in)",
    details: ["Porcelain", "Fluted pedestal silhouette", "Finished in white"],
    description:
      "A sculptural porcelain bowl with fine vertical fluting, raised on a pedestal foot. Made for abundant, garden-style arrangements, it anchors a tablescape with the quiet confidence of a piece that belongs in the room. Shown here styled with fresh florals at a recent celebration.",
    image: "/shop/fisher-bowl-white-event.jpg",
    imageAlt: "White fluted porcelain pedestal bowl holding a lush floral arrangement on a candlelit table",
    gallery: ["/shop/fisher-bowls-pair.jpg"],
  },
  {
    slug: "fisher-pedestal-bowl-black",
    paymentLink: "https://buy.stripe.com/7sY14n7Amb4X5kv5oc4sE01",
    name: "Fisher Pedestal Bowl, Black",
    price: 59.99,
    availability: "pre-sale",
    deposit: 30.0,
    size: "25 × 25 cm (about 10 × 10 in)",
    details: ["Porcelain", "Fluted pedestal silhouette", "Finished in black"],
    description:
      "A sculptural porcelain bowl with fine vertical fluting, raised on a pedestal foot. In black, the silhouette turns graphic and modern: a striking vessel for florals, fruit, or candlelight, and a dramatic counterpoint on a pale table.",
    image: "/shop/fisher-bowls-pair.jpg",
    imageAlt: "Black and white fluted porcelain pedestal bowls",
    gallery: ["/shop/fisher-bowl-black.jpg"],
  },
  {
    slug: "crystal-lamp-shades-small-set",
    paymentLink: "https://buy.stripe.com/9B628r4oac913cng2Q4sE02",
    name: "Crystal Lamp Shades, Small Set of 3",
    price: 69.99,
    availability: "pre-sale",
    deposit: 35.0,
    size: "Shades of 42, 47, and 52 cm",
    details: ["Set of three graduated shades", "Faceted crystal", "Designed to crown taper candles"],
    description:
      "A graduated trio of faceted crystal shades that crown taper candles with a soft, prismatic glow. In three heights, the set layers light across a table the way a stylist layers texture: quietly, and to beautiful effect.",
    image: "/shop/lamp-shades-red-table.jpg",
    imageAlt: "Faceted crystal lamp shades glowing over taper candles",
    hoverImage: "/shop/lamp-shades-small-trio.jpg",
    gallery: ["/shop/lamp-shades-event.jpg", "/shop/lamp-shades-small-trio.jpg"],
  },
  {
    slug: "crystal-lamp-shades-large-set",
    paymentLink: "https://buy.stripe.com/8x228r7Am7SLbIT8Ao4sE03",
    name: "Crystal Lamp Shades, Large Set of 3",
    price: 149.99,
    availability: "pre-sale",
    deposit: 75.0,
    size: "Shades of 60, 70, and 80 cm",
    details: ["Set of three graduated shades", "Faceted crystal", "Statement scale for tall tapers"],
    description:
      "The grander scale of a studio favorite: three faceted crystal shades in statement heights that crown tall tapers and turn candlelight into architecture. Made for head tables, mantels, and rooms that ask for presence.",
    image: "/shop/lamp-shades-white-room.jpg",
    imageAlt: "Faceted crystal lamp shades glowing over taper candles",
    hoverImage: "/shop/lamp-shades-large-sizes.jpg",
    gallery: ["/shop/lamp-shades-dahlia.jpg", "/shop/lamp-shades-large-sizes.jpg"],
  },
  {
    slug: "round-mirror-centerpiece-riser-gold",
    paymentLink: "https://buy.stripe.com/7sY3cv8Eqeh9bIT6sg4sE04",
    name: "Round Mirror Centerpiece Riser, Gold",
    price: 119.99,
    availability: "pre-sale",
    deposit: 60.0,
    details: ["Mirrored surface", "Gold finish only", "Made for centerpieces and candle groupings"],
    description:
      "A round mirrored riser with a gilded edge that lifts a centerpiece and doubles its candlelight. The reflection does the quiet work. Florals read fuller, flames read warmer, and the whole table glows. Offered in the gold finish only.",
    image: "/shop/mirror-riser-event.jpg",
    imageAlt: "Round gold mirror centerpiece riser",
    hoverImage: "/shop/mirror-riser-gold-full.jpg",
    gallery: ["/shop/mirror-riser-gold-close.jpg", "/shop/mirror-riser-vendor.jpg", "/shop/mirror-riser-gold-full.jpg"],
  },
  {
    slug: "tall-glass-hurricane-taper-holders-set",
    paymentLink: "https://buy.stripe.com/8x200j2g2fld7sD5oc4sE0b",
    name: "Tall Glass Hurricane Taper Holders, Set of 3",
    price: 69.99,
    availability: "pre-sale",
    deposit: 35,
    details: ["Set of three", "Tall glass hurricanes", "Shields and lengthens the flame"],
    description:
      "Tall glass hurricanes that shelter taper flames and draw the eye upward. Grouped in threes, they give a table rhythm and height while keeping every candle burning clean and steady.",
    image: "/shop/hurricane-tapers-event.jpg",
    imageAlt: "Tall glass hurricane taper candle holders",
    gallery: ["/shop/hurricane-taper-holders.jpg"],
  },
  {
    slug: "glass-candle-holder-set-medium",
    paymentLink: "https://buy.stripe.com/3cI28rbQC1uncMXbMA4sE06",
    name: "Glass Candle Holder Set of 3, Medium",
    price: 49.99,
    availability: "pre-sale",
    deposit: 25.0,
    size: "35, 40, and 45 cm",
    details: ["Set of three graduated heights", "Clear glass", "For pillars and tapers alike"],
    description:
      "A graduated set of clear glass candle holders in three medium heights. The varied levels let candlelight move across a table in steps. It's the simplest way to make a setting feel considered.",
    image: "/shop/medium-holders-event.jpg",
    imageAlt: "Glass candle holders in graduated heights",
    gallery: ["/shop/medium-holders-trio.jpg", "/shop/medium-holders-lit.jpg"],
  },
  {
    slug: "stemmed-floating-candle-holders-set",
    paymentLink: "https://buy.stripe.com/aFa3cvcUGgphdR1eYM4sE0c",
    name: "Stemmed Floating Candle Holders, Set of 3",
    price: 39.99,
    availability: "pre-sale",
    deposit: 20,
    details: ["Set of three", "Stemmed glass cups", "Made for floating candles"],
    description:
      "Stemmed glass cups made for floating candles, lifting a small flame to just the right height among the florals. A finishing detail that guests feel before they notice.",
    image: "/shop/floating-holders-event.jpg",
    imageAlt: "Stemmed floating candle holders",
    gallery: ["/shop/floating-candle-holders.jpg"],
  },
];

export const AVAILABLE_PRODUCTS: Product[] = [
  {
    slug: "classic-tripod-vase",
    paymentLink: "https://buy.stripe.com/6oU14n4oa2yraEPcQE4sE08",
    name: "Classic Tripod Vase",
    price: 89.99,
    availability: "available",
    details: ["Tripod-footed silhouette", "A timeless vessel for tall arrangements"],
    description:
      "A classic vase raised on three feet, with the balanced proportions that have carried beautiful arrangements for generations. Equally at home with branches, orchids, or a loose gathering of garden roses.",
    image: "/shop/classic-tripod-vase-clean.jpg",
    imagePosition: "center 70%",
    imageAlt: "Classic tripod vase",
  },
  {
    slug: "hexagonal-clear-acrylic-block",
    paymentLink: "https://buy.stripe.com/7sYeVd9Iuc91aEP03S4sE09",
    name: "Hexagonal Clear Acrylic Block",
    price: 59.99,
    availability: "available",
    details: ["Clear acrylic", "Six-sided geometric form", "Adds height without visual weight"],
    description:
      "A six-sided clear block that adds height to a tablescape without adding visual weight. Use it to lift a vase, a candle grouping, or a single sculptural object. The light passes through, and the styling reads effortless.",
    image: "/shop/acrylic-block.jpg",
    imageAlt: "Hexagonal clear acrylic block",
  },
  {
    slug: "round-glass-bud-vase",
    paymentLink: "https://buy.stripe.com/7sYcN56widd5aEP6sg4sE0a",
    name: "Round Glass Bud Vase",
    price: 59.99,
    availability: "available",
    details: ["Glass ring silhouette", "Made for a single stem", "Priced each"],
    description:
      "A round glass bud vase with a delicate ring silhouette, made for a single stem. Scattered down a table, a few blooms, beautifully spaced, can say more than an arrangement.",
    image: "/shop/bud-vases.jpg",
    imageAlt: "Round glass bud vase",
  },
];

export const PRODUCTS: Product[] = [...PRE_SALE_PRODUCTS, ...AVAILABLE_PRODUCTS];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Amount due today for one unit: the deposit on pre-sale pieces, full price otherwise. */
export function dueToday(product: Product): number {
  return product.availability === "pre-sale" && product.deposit !== undefined
    ? product.deposit
    : product.price;
}

/** Balance due on arrival for one unit (zero for pieces available now). */
export function balanceOnArrival(product: Product): number {
  return product.price - dueToday(product);
}

// Meta Commerce catalog content IDs -> site product slugs.
// Used by the /checkout endpoint Meta redirects shop customers to.
export const META_CONTENT_ID_TO_SLUG: Record<string, string> = {
  // Catalog content (retailer) IDs
  "fisher-bowl-white": "fisher-pedestal-bowl-white",
  "fisher-bowl-black": "fisher-pedestal-bowl-black",
  "rlylipqwhp": "hexagonal-clear-acrylic-block",
  "vis59celi5": "round-glass-bud-vase",
  "zp7rnl1bkm": "round-mirror-centerpiece-riser-gold",
  "5718suqron": "crystal-lamp-shades-large-set",
  "dw541ihyfj": "crystal-lamp-shades-small-set",
  "zq58f889ar": "classic-tripod-vase",
  "a8q0tsi50n": "stemmed-floating-candle-holders-set",
  "3n00jkc1as": "tall-glass-hurricane-taper-holders-set",
  "woodahw4ef": "glass-candle-holder-set-medium",
  // Meta numeric item IDs (same items)
  "30532247669698437": "fisher-pedestal-bowl-white",
  "29159250657078240": "fisher-pedestal-bowl-black",
  "29051627594458639": "hexagonal-clear-acrylic-block",
  "39891615953817529": "round-glass-bud-vase",
  "40039232055722943": "round-mirror-centerpiece-riser-gold",
  "29911576958450248": "crystal-lamp-shades-large-set",
  "29121907564140478": "crystal-lamp-shades-small-set",
  "39909726045342078": "classic-tripod-vase",
  "39952213947726838": "stemmed-floating-candle-holders-set",
  "28863968759970682": "tall-glass-hurricane-taper-holders-set",
  "28750077821359713": "glass-candle-holder-set-medium",
};
