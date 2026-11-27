import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/shop/AddToCart";
import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/shop/ProductGallery";
import {
  PRODUCTS,
  balanceOnArrival,
  dueToday,
  formatPrice,
  getProductBySlug,
} from "@/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const isPreSale = product.availability === "pre-sale";
  const related = PRODUCTS.filter(
    (other) => other.slug !== product.slug && other.availability === product.availability,
  ).slice(0, 3);
  const images = [product.image, ...(product.gallery ?? [])];

  return (
    <main className="w-full bg-ivory text-ink flex flex-col relative">
      <section className="w-full px-6 md:px-12 pt-32 md:pt-44 pb-16 md:pb-24 border-b border-ink/20">
        <div className="max-w-[1440px] mx-auto">
          <Link
            href="/shop"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-gold transition-colors"
          >
            ← Back to the Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-8">
            {/* IMAGES — studio picture first, then the product picture scrolls across to the right */}
            <ProductGallery images={images} alt={product.imageAlt} isPreSale={isPreSale} />

            {/* DETAILS */}
            <div className="flex flex-col">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold block mb-4">
                {isPreSale ? "Pre-Sale · Arriving Spring 2027" : "Available Now"}
              </span>
              <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-display text-3xl text-ink">{formatPrice(product.price)}</span>
                {isPreSale && (
                  <span className="font-body text-sm text-ink/60">
                    Reserve today with a {formatPrice(dueToday(product))} deposit
                  </span>
                )}
              </div>

              <p className="font-body text-sm md:text-base text-ink/80 leading-relaxed max-w-xl mb-10">
                {product.description}
              </p>

              <div className="flex flex-col gap-3 border-t border-ink/15 pt-8 mb-10">
                {product.size && (
                  <div className="flex gap-6">
                    <span className="font-body text-[9px] uppercase tracking-[0.2em] text-ink/50 w-24 shrink-0 pt-0.5">
                      Size
                    </span>
                    <span className="font-body text-sm text-ink/85">{product.size}</span>
                  </div>
                )}
                <div className="flex gap-6">
                  <span className="font-body text-[9px] uppercase tracking-[0.2em] text-ink/50 w-24 shrink-0 pt-0.5">
                    Details
                  </span>
                  <span className="font-body text-sm text-ink/85">{product.details.join(" · ")}</span>
                </div>
              </div>

              {isPreSale && (
                <div className="border border-gold/50 bg-gold/10 p-6 mb-10">
                  <span className="font-body text-[9px] uppercase tracking-[0.2em] text-gold block mb-3 font-semibold">
                    How Pre-Sale Works
                  </span>
                  <ul className="flex flex-col gap-2 font-body text-sm text-ink/80 leading-relaxed">
                    <li>
                      Reserve today with a deposit of {formatPrice(dueToday(product))} per piece — half the{" "}
                      {formatPrice(product.price)} price.
                    </li>
                    <li>
                      The balance of {formatPrice(balanceOnArrival(product))} per piece is due when your pieces
                      arrive in Spring 2027.
                    </li>
                    <li>Deposits are non-refundable.</li>
                  </ul>
                </div>
              )}

              <AddToCart slug={product.slug} isPreSale={isPreSale} paymentLink={product.paymentLink} dueToday={dueToday(product)} />

              <p className="font-body text-xs text-ink/50 leading-relaxed mt-8 max-w-md">
                Questions about a piece, quantities for an event, or styling advice?{" "}
                <Link href="/inquire" className="text-gold underline underline-offset-4 hover:text-ink transition-colors">
                  Send the studio an inquiry
                </Link>{" "}
                and Irene will follow up directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="w-full px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight mb-10">
              Pairs <span className="italic text-gold">beautifully</span> with
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((other) => (
                <ProductCard key={other.slug} product={other} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
