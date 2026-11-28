import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Contact from "@/components/sections/Contact";
import ProductCard from "@/components/shop/ProductCard";
import { AVAILABLE_PRODUCTS, PRE_SALE_PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the Lady Victoria Designs collection: pedestal bowls, crystal lamp shades, risers, vases, and candlelight pieces for celebrations and home. Pre-sale pieces arriving Spring 2027 can be reserved with a deposit.",
  alternates: { canonical: "/shop" },
};

// The three-photo strip under the hero. Each photo opens the piece it shows.
const PHOTO_TILES = [
  {
    title: "Candlelight",
    link: "Shop the taper holders",
    href: "/shop/tall-glass-hurricane-taper-holders-set",
    src: "/shop/hurricane-tapers-event.jpg",
    alt: "Tall glass hurricane taper holders lit along a white floral table",
    position: "center",
  },
  {
    title: "Crystal Lamp Shades",
    link: "Shop the lamp shades",
    href: "/shop/crystal-lamp-shades-small-set",
    src: "/shop/lamp-shades-dahlia.jpg",
    alt: "Three crystal lamp shades glowing over a table of dahlias and roses",
    position: "center 30%",
  },
  {
    title: "Risers & Bowls",
    link: "Shop the mirror riser",
    href: "/shop/round-mirror-centerpiece-riser-gold",
    src: "/shop/mirror-riser-event.jpg",
    alt: "A gold round mirror riser under a centerpiece of pink and red roses",
    position: "center 45%",
  },
];

export default function ShopPage() {
  return (
    <main className="w-full bg-ivory text-ink flex flex-col relative">
      {/* HERO: full photo, text bottom left, like the homepage */}
      <section className="relative w-full min-h-[88svh] bg-ink overflow-hidden flex flex-col justify-end px-6 sm:px-10 md:px-12 pb-12 sm:pb-16">
        <Image
          src="/shop/fisher-bowl-white-event.jpg"
          alt="A Lady Victoria Designs table with white Fisher pedestal bowls, crystal lamp shades, and candlelight"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 55%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/45 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-start gap-5">
          <div className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ivory/90">The Shop</div>
          <h1 className="font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.95] text-ivory tracking-tight">
            Pieces the studio <span className="italic">loves</span>
          </h1>
          <p className="font-body text-ivory/85 max-w-xl leading-relaxed text-sm md:text-base">
            The vases, risers, and candlelight pieces from our tablescapes, now for your own celebrations and
            home. Reserve pre-sale pieces with a deposit, or bring home what&apos;s in the studio today.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href="#pre-sale"
              className="bg-ivory text-ink font-body text-[10px] uppercase tracking-[0.2em] px-7 py-4 hover:bg-gold transition-colors"
            >
              Shop Pre-Sale
            </a>
            <a
              href="#available-now"
              className="border border-ivory/70 text-ivory font-body text-[10px] uppercase tracking-[0.2em] px-7 py-4 hover:bg-ivory hover:text-ink transition-colors"
            >
              Available Now
            </a>
          </div>
        </div>
      </section>

      {/* PHOTO STRIP: three tall photos side by side (swipe on phones) */}
      <section className="w-full px-6 md:px-12 pt-16 md:pt-24">
        <div className="max-w-[1440px] mx-auto flex sm:grid sm:grid-cols-3 gap-4 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-6 px-6 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          {PHOTO_TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group shrink-0 w-[78%] sm:w-auto snap-start flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-ecru">
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 78vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  style={{ objectPosition: tile.position }}
                />
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-ink mt-5">{tile.title}</h2>
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-ink/70 mt-2 underline underline-offset-4 decoration-ink/30 group-hover:text-ink group-hover:decoration-ink transition-colors">
                {tile.link}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRE-SALE */}
      <section id="pre-sale" className="scroll-mt-20 w-full px-6 md:px-12 py-16 md:py-24 border-b border-ink/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">RESERVE NOW</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                Pre-Sale, <span className="italic text-gold">Arriving Spring 2027</span>
              </h2>
            </div>
            <p className="font-body text-sm text-ink/70 leading-relaxed max-w-md">
              Reserve each piece with a 50% deposit today. Deposits are non-refundable, and the balance is due
              when your pieces arrive in Spring 2027.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRE_SALE_PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO BREAK: one full-width photo between the two product grids */}
      <section className="relative w-full h-[70svh] min-h-[420px] bg-ink overflow-hidden flex items-end px-6 sm:px-10 md:px-12 pb-10 md:pb-14">
        <Image
          src="/gallery/laura-ken/1sm08322.jpg"
          alt="Tall white floral centerpieces glowing in a candlelit ballroom styled by Lady Victoria Designs"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 50%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <h2 className="font-display text-ivory text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] tracking-tight">
            Styled by <span className="italic">the studio</span>
          </h2>
          <Link
            href="/gallery"
            className="self-start md:self-auto font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ivory underline underline-offset-4 decoration-ivory/50 hover:decoration-ivory transition-colors"
          >
            See our work
          </Link>
        </div>
      </section>

      {/* AVAILABLE NOW */}
      <section id="available-now" className="scroll-mt-20 w-full px-6 md:px-12 py-16 md:py-24 border-b border-ink/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">IN THE STUDIO</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">Available Now</h2>
            </div>
            <p className="font-body text-sm text-ink/70 leading-relaxed max-w-md">
              Ready to bring home today. The finishing pieces for a table that feels considered, layered, and
              lit beautifully.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}
