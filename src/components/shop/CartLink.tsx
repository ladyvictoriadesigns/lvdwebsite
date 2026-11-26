"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/shop/CartProvider";

export default function CartLink() {
  const { count } = useCart();
  const pathname = usePathname();
  const isActive = pathname === "/shop/cart";

  return (
    <Link
      href="/shop/cart"
      className={`hover:text-gold transition-colors py-1 flex items-center gap-2 ${isActive ? "text-gold font-bold" : ""}`}
      aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
    >
      <span>Cart</span>
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-gold text-ivory font-body text-[10px] tracking-normal">
          {count}
        </span>
      )}
    </Link>
  );
}
