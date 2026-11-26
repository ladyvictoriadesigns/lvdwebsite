import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Lady Victoria Designs shop pieces and reserve them.",
  alternates: { canonical: "/shop/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <main className="w-full bg-ivory text-ink flex flex-col relative">
      <section className="w-full px-6 md:px-12 pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-6 font-body">THE SHOP</div>
          <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] text-ink leading-tight mb-12">
            Your <span className="italic text-gold">cart</span>
          </h1>
          <CartView />
        </div>
      </section>
    </main>
  );
}
