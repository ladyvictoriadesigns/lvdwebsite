import Image from "next/image";
import Link from "next/link";

export default function ShopSign() {
  return (
    <section className="w-full bg-ivory text-ink border-b border-ink/20">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* SIGN */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-16 md:py-24 order-2 lg:order-1">
          <div className="font-body text-[10px] uppercase tracking-[0.25em] text-gold mb-6">
            Now Open
          </div>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[1.02] text-ink mb-6">
            The <span className="italic text-gold">Shop</span>
          </h2>
          <p className="font-body text-ink/70 leading-relaxed text-sm md:text-base max-w-md mb-10">
            The pedestal bowls, crystal shades, risers, and candlelight pieces that shape our
            tablescapes — now offered for your own celebrations and home. Reserve pre-sale pieces
            with a deposit, or bring home what is in the studio today.
          </p>
          <div>
            <Link
              href="/shop"
              className="inline-block bg-ink text-ivory font-body text-[11px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-gold hover:text-ink transition-colors"
            >
              Shop the Collection
            </Link>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative w-full min-h-[320px] lg:min-h-[560px] order-1 lg:order-2">
          <Image
            src="/shop/fisher-bowl-white-event.jpg"
            alt="A Lady Victoria Designs tablescape with pedestal bowls, crystal shades, and candlelight"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
