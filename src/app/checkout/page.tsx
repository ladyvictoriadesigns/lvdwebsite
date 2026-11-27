import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  META_CONTENT_ID_TO_SLUG,
  balanceOnArrival,
  dueToday,
  formatPrice,
  getProductBySlug,
  type Product,
} from "@/data/products";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Lady Victoria Designs shop order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
};

interface CheckoutLine {
  product: Product | null;
  contentId: string;
  quantity: number;
}

function parseProducts(raw: string | undefined): CheckoutLine[] {
  if (!raw) return [];
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [id, qtyRaw] = part.split(":");
      const quantity = Math.max(1, Math.min(99, parseInt(qtyRaw ?? "1", 10) || 1));
      const slug = META_CONTENT_ID_TO_SLUG[id];
      return {
        product: slug ? getProductBySlug(slug) ?? null : null,
        contentId: id,
        quantity,
      };
    });
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ products?: string; coupon?: string; cart_origin?: string }>;
}) {
  const params = await searchParams;
  const lines = parseProducts(params.products);
  const known = lines.filter((l) => l.product);
  const dueTotal = known.reduce((sum, l) => sum + dueToday(l.product!) * l.quantity, 0);
  const fullTotal = known.reduce((sum, l) => sum + l.product!.price * l.quantity, 0);
  const balanceTotal = known.reduce((sum, l) => sum + balanceOnArrival(l.product!) * l.quantity, 0);

  return (
    <main className="w-full bg-ivory text-ink flex flex-col relative">
      <section className="w-full px-6 md:px-12 pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-6 font-body">THE SHOP</div>
          <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] text-ink leading-tight mb-12">
            Your <span className="italic text-gold">checkout</span>
          </h1>

          {lines.length === 0 ? (
            <div className="border border-ink/15 bg-white/60 p-8 md:p-12">
              <p className="font-body text-base text-ink/80 mb-8">
                This checkout link did not include any pieces. Browse the collection and choose the pieces you
                love — each product page has its own secure card checkout.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-ink text-ivory font-body text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-ink transition-colors"
              >
                Shop the Collection
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col divide-y divide-ink/10 border-y border-ink/15">
                {lines.map((line, i) =>
                  line.product ? (
                    <div key={i} className="flex flex-wrap items-center gap-6 py-6">
                      <div className="relative w-24 h-24 shrink-0 bg-white">
                        <Image
                          src={line.product.image}
                          alt={line.product.imageAlt}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1 min-w-[220px]">
                        <Link
                          href={`/shop/${line.product.slug}`}
                          className="font-display text-xl text-ink hover:text-gold transition-colors"
                        >
                          {line.product.name}
                        </Link>
                        <p className="font-body text-sm text-ink/70 mt-1">
                          Quantity {line.quantity} · {formatPrice(line.product.price)} each
                        </p>
                        {line.product.availability === "pre-sale" && (
                          <p className="font-body text-sm text-ink/70">
                            Pre-sale — {formatPrice(dueToday(line.product))} deposit per piece today,{" "}
                            {formatPrice(balanceOnArrival(line.product))} due when it arrives in Spring 2027.
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-body text-sm text-ink/60">Due today</p>
                        <p className="font-display text-2xl text-ink">
                          {formatPrice(dueToday(line.product) * line.quantity)}
                        </p>
                      </div>
                      <a
                        href={line.product.paymentLink}
                        className="bg-gold text-ink font-body text-[10px] uppercase tracking-[0.2em] px-6 py-4 hover:bg-ink hover:text-ivory transition-colors"
                      >
                        Pay by Card
                      </a>
                    </div>
                  ) : (
                    <div key={i} className="py-6">
                      <p className="font-body text-sm text-ink/70">
                        Shop piece (reference {line.contentId}) · Quantity {line.quantity} — find it in{" "}
                        <Link href="/shop" className="text-gold underline underline-offset-4">
                          the collection
                        </Link>
                        .
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-10 flex flex-col gap-2 items-end">
                <p className="font-body text-sm text-ink/70">
                  Order total: <span className="text-ink">{formatPrice(fullTotal)}</span>
                </p>
                {balanceTotal > 0 && (
                  <p className="font-body text-sm text-ink/70">
                    Due on arrival (Spring 2027): <span className="text-ink">{formatPrice(balanceTotal)}</span>
                  </p>
                )}
                <p className="font-display text-3xl text-ink mt-2">Due today: {formatPrice(dueTotal)}</p>
                {params.coupon && (
                  <p className="font-body text-sm text-ink/70">
                    Coupon noted: {params.coupon} — mention it when you pay and it will be honored on your
                    order.
                  </p>
                )}
                <p className="font-body text-sm text-ink/60 mt-4 max-w-[560px] text-right">
                  Pay each piece securely by card with its button above — choose the same quantity on the
                  payment page. Maryland sales tax is calculated at payment for Maryland addresses. Prefer to
                  reserve everything together first?{" "}
                  <Link href="/shop/cart" className="text-gold underline underline-offset-4">
                    Use the cart
                  </Link>
                  .
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
