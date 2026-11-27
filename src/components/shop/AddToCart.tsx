"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";

export default function AddToCart({
  slug,
  isPreSale,
  paymentLink,
  dueToday,
}: {
  slug: string;
  isPreSale: boolean;
  paymentLink: string;
  dueToday: number;
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(slug, quantity);
    setAdded(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-stretch gap-4">
        <div className="flex items-center border border-ink/30">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 font-body text-base text-ink hover:text-gold transition-colors cursor-pointer"
          >
            −
          </button>
          <span className="w-10 text-center font-body text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="px-4 py-3 font-body text-base text-ink hover:text-gold transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 min-w-[200px] bg-ink text-ivory font-body text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-ink transition-colors cursor-pointer"
        >
          {isPreSale ? "Add to Cart — Reserve with Deposit" : "Add to Cart"}
        </button>
      </div>

      {added && (
        <p className="font-body text-xs text-ink/70">
          Added to your cart.{" "}
          <Link href="/shop/cart" className="text-gold underline underline-offset-4 hover:text-ink transition-colors">
            View cart &amp; reserve your pieces
          </Link>
        </p>
      )}

      <a
        href={paymentLink}
        className="block text-center bg-gold text-ink font-body text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-ink hover:text-ivory transition-colors"
      >
        {isPreSale
          ? `Pay Deposit by Card — $${dueToday.toFixed(2)}`
          : `Buy Now by Card — $${dueToday.toFixed(2)}`}
      </a>
      <p className="font-body text-xs text-ink/60">
        Secure checkout by Stripe{isPreSale ? " — the deposit is per piece" : ""}. Choose your quantity on the
        payment page.
      </p>
    </div>
  );
}
