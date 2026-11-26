import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import ProductCard from "@/components/shop/ProductCard";
import { AVAILABLE_PRODUCTS, PRE_SALE_PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the Lady Victoria Designs collection — pedestal bowls, crystal lamp shades, risers, vases, and candlelight pieces for celebrations and home. Pre-sale pieces arriving Spring 2027 can be reserved with a deposit.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <main className="w-full bg-ivory text-ink flex flex-col relative">
      {/* HERO */}
      <section className="w-full flex flex-col justify-center items-center text-center px-6 md:px-12 pt-32 md:pt-44 pb-16 md:pb-24 border-b border-ink/20">
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-6 font-body">THE SHOP</div>
        <h1 className="font-display text-[clamp(2.5rem,6vw,6.5rem)] text-ink max-w-5xl mx-auto leading-tight mb-8">
          Pieces the studio <span className="italic text-gold">loves</span>
        </h1>
        <p className="font-body text-ink/70 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          The vases, risers, and candlelight pieces that shape the studio&apos;s tablescapes — now offered for
          your own celebrations and home. Pieces marked pre-sale arrive with the Spring 2027 shipment and can
          be reserved today with a deposit; the balance is due when your pieces arrive.
        </p>
      </section>

      {/* PRE-SALE */}
      <section className="w-full px-6 md:px-12 py-16 md:py-24 border-b border-ink/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">RESERVE NOW</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
                Pre-Sale — <span className="italic text-gold">Arriving Spring 2027</span>
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

      {/* AVAILABLE NOW */}
      <section className="w-full px-6 md:px-12 py-16 md:py-24 border-b border-ink/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-4">IN THE STUDIO</div>
              <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">Available Now</h2>
            </div>
            <p className="font-body text-sm text-ink/70 leading-relaxed max-w-md">
              Ready to bring home today — the finishing pieces for a table that feels considered, layered, and
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
