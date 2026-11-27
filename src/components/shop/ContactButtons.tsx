export const WHATSAPP_NUMBER = "13013120332";
export const MESSENGER_LINK = "https://m.me/LadyVictoriaDesign";

export function whatsappLink(productName?: string): string {
  const text = productName
    ? `Hello Lady Victoria Designs, I have a question about the ${productName}.`
    : "Hello Lady Victoria Designs, I have a question about a piece in the shop.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function ContactButtons({ productName }: { productName?: string }) {
  return (
    <div className="mt-8">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-ink/60 mb-3">
        Questions about this piece?
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappLink(productName)}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink/30 text-ink font-body text-[10px] uppercase tracking-[0.2em] px-6 py-3 hover:border-gold hover:text-gold transition-colors"
        >
          Message on WhatsApp
        </a>
        <a
          href={MESSENGER_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink/30 text-ink font-body text-[10px] uppercase tracking-[0.2em] px-6 py-3 hover:border-gold hover:text-gold transition-colors"
        >
          Message on Messenger
        </a>
      </div>
    </div>
  );
}
