import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/data/products";

const SIZES = "(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw";

export default function ProductCard({ product }: { product: Product }) {
  const isPreSale = product.availability === "pre-sale";
  // A plain product photo fades in when you point at the card (computers only).
  const hoverImage = product.hoverImage ?? product.gallery?.[0];

  return (
    <Link href={`/shop/${product.slug}`} className="group flex flex-col">
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl bg-ecru shadow-[0_1px_2px_rgba(20,18,15,0.06)] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_-18px_rgba(20,18,15,0.35)]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes={SIZES}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: product.imagePosition ?? "center" }}
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            aria-hidden
            fill
            sizes={SIZES}
            className="object-contain bg-ecru opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:hidden"
          />
        )}

        <span
          className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 rounded-full px-2.5 sm:px-3 py-1 font-body text-[10px] sm:text-[11px] font-medium backdrop-blur-md ${
            isPreSale ? "bg-ink/80 text-ivory" : "bg-ivory/90 text-ink"
          }`}
        >
          {isPreSale ? "Pre-sale" : "In stock"}
        </span>

        {/* Quick action: slides up on hover (computers). The whole card is the link. */}
        <span className="absolute inset-x-3 bottom-3 flex items-center justify-center rounded-full bg-ivory/95 py-3 font-body text-[13px] font-medium text-ink shadow-sm backdrop-blur-md translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:hidden">
          {isPreSale ? `Reserve for ${formatPrice(product.deposit ?? 0)}` : "Shop now"}
        </span>
      </div>

      <div className="flex flex-col pt-4 px-1">
        <h3 className="font-body text-[14px] sm:text-[15px] font-medium text-ink leading-snug">{product.name}</h3>
        <p className="font-body text-[12px] sm:text-[13px] text-ink/55 mt-1">
          {product.size ?? (isPreSale ? "Arriving Spring 2027" : "In the studio now")}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-2">
          <span className="font-body text-[15px] font-semibold text-ink">{formatPrice(product.price)}</span>
          {isPreSale && product.deposit !== undefined && (
            <span className="font-body text-[12px] sm:text-[13px] text-ink/55">or {formatPrice(product.deposit)} deposit today</span>
          )}
        </div>
      </div>
    </Link>
  );
}
