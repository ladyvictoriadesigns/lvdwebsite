"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { balanceOnArrival, dueToday, formatPrice } from "@/data/products";

export default function CartView() {
  const { lines, setQuantity, remove, clear } = useCart();
  const [showReserveNote, setShowReserveNote] = useState(false);

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => ({
        total: acc.total + line.product.price * line.quantity,
        dueToday: acc.dueToday + dueToday(line.product) * line.quantity,
        onArrival: acc.onArrival + balanceOnArrival(line.product) * line.quantity,
      }),
      { total: 0, dueToday: 0, onArrival: 0 },
    );
  }, [lines]);

  const reservationSummary = useMemo(() => {
    if (lines.length === 0) return "";
    const items = lines
      .map((line) => `${line.quantity} × ${line.product.name} (${formatPrice(line.product.price)} each)`)
      .join("; ");
    return `Shop reservation: ${items}. Total ${formatPrice(totals.total)} — ${formatPrice(totals.dueToday)} due today${
      totals.onArrival > 0 ? `, ${formatPrice(totals.onArrival)} due on arrival (Spring 2027 pre-sale)` : ""
    }.`;
  }, [lines, totals]);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16">
        <p className="font-display italic text-2xl md:text-3xl text-ink/70 mb-8">Your cart is empty.</p>
        <Link
          href="/shop"
          className="font-body text-[10px] uppercase tracking-[0.2em] border border-ink/30 px-10 py-4 hover:bg-ink hover:text-ivory transition-colors"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
      {/* LINES */}
      <div className="lg:col-span-2 flex flex-col">
        {lines.map((line) => {
          const isPreSale = line.product.availability === "pre-sale";
          return (
            <article
              key={line.slug}
              className="flex gap-5 sm:gap-8 py-6 border-b border-ink/15 first:pt-0"
            >
              <Link
                href={`/shop/${line.product.slug}`}
                className="relative w-24 h-28 sm:w-32 sm:h-40 shrink-0 overflow-hidden bg-ecru border border-ink/15"
              >
                <Image
                  src={line.product.image}
                  alt={line.product.imageAlt}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/shop/${line.product.slug}`}
                      className="font-display text-xl md:text-2xl text-ink leading-snug hover:text-gold transition-colors"
                    >
                      {line.product.name}
                    </Link>
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mt-1">
                      {isPreSale ? "Pre-Sale · Arriving Spring 2027" : "Available Now"}
                    </p>
                  </div>
                  <span className="font-body text-base text-ink whitespace-nowrap">
                    {formatPrice(line.product.price * line.quantity)}
                  </span>
                </div>

                {isPreSale && (
                  <p className="font-body text-xs text-ink/60 mt-2">
                    {formatPrice(dueToday(line.product))} deposit due today ·{" "}
                    {formatPrice(balanceOnArrival(line.product))} due on arrival, per piece
                  </p>
                )}

                <div className="flex items-center gap-6 mt-auto pt-4">
                  <div className="flex items-center border border-ink/30">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${line.product.name}`}
                      onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      className="px-3 py-2 font-body text-sm text-ink hover:text-gold transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-body text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${line.product.name}`}
                      onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      className="px-3 py-2 font-body text-sm text-ink hover:text-gold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.slug)}
                    className="font-body text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-ink transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <button
          type="button"
          onClick={clear}
          className="self-start mt-6 font-body text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink transition-colors cursor-pointer"
        >
          Clear cart
        </button>
      </div>

      {/* SUMMARY */}
      <aside className="border border-ink/20 p-8 h-fit flex flex-col gap-5 bg-ivory">
        <h2 className="font-display text-2xl text-ink">Your Reservation</h2>

        <div className="flex flex-col gap-3 font-body text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Total</span>
            <span className="text-ink">{formatPrice(totals.total)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-3">
            <span className="text-ink/60">Due today</span>
            <span className="text-ink font-medium">{formatPrice(totals.dueToday)}</span>
          </div>
          {totals.onArrival > 0 && (
            <div className="flex justify-between">
              <span className="text-ink/60">Due on arrival · Spring 2027</span>
              <span className="text-ink">{formatPrice(totals.onArrival)}</span>
            </div>
          )}
        </div>

        <p className="font-body text-xs text-ink/55 leading-relaxed">
          Due today covers full payment for pieces available now, plus the non-refundable deposit on each
          pre-sale piece. The remaining balance on pre-sale pieces is due when they arrive.
        </p>

        <button
          type="button"
          onClick={() => setShowReserveNote(true)}
          className="bg-ink text-ivory font-body text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-ink transition-colors cursor-pointer w-full"
        >
          Reserve Your Pieces
        </button>

        {showReserveNote && (
          <div className="border border-gold/50 bg-gold/10 p-5 flex flex-col gap-3" role="status">
            <span className="font-body text-[9px] uppercase tracking-[0.2em] text-gold font-semibold">
              Online Checkout Opens Soon
            </span>
            <p className="font-body text-xs text-ink/75 leading-relaxed">
              Online payment for the shop is being set up and opens soon. To reserve these pieces today, send
              the studio your reservation through the inquiry form — your pieces and deposit details below will
              travel with the message — and Irene will confirm your reservation personally.
            </p>
            <p className="font-body text-xs text-ink/60 leading-relaxed border-t border-ink/10 pt-3">
              {reservationSummary}
            </p>
            <Link
              href="/inquire"
              className="font-body text-[10px] uppercase tracking-[0.2em] border border-ink/30 px-6 py-3 text-center hover:bg-ink hover:text-ivory transition-colors"
            >
              Send Reservation via Inquiry
            </Link>
          </div>
        )}

        <Link
          href="/shop"
          className="font-body text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-gold transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
