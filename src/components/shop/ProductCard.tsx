import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const isPreSale = product.availability === "pre-sale";

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col border border-ink/15 bg-ivory hover:border-ink/40 transition-colors"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-ecru">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain"
        />
        {isPreSale && (
          <span className="absolute top-4 left-4 bg-ink text-ivory font-body text-[9px] uppercase tracking-[0.2em] px-3 py-1.5">
            Pre-Sale · Reserve with {formatPrice(product.deposit ?? 0)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-6">
        <h3 className="font-display text-xl md:text-2xl text-ink leading-snug group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        {product.size && (
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-ink/50">{product.size}</p>
        )}
        <div className="flex items-baseline justify-between mt-2">
          <span className="font-body text-base text-ink">{formatPrice(product.price)}</span>
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold">
            {isPreSale ? "Arriving Spring 2027" : "Available Now"}
          </span>
        </div>
      </div>
    </Link>
  );
}
