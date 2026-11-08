import { whatsappUrl } from "@/lib/contact";
import { WhatsAppIcon } from "./SocialIcons";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Silverfox on WhatsApp (opens in a new tab)"
      title="Chat on WhatsApp"
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 flex size-14 items-center justify-center rounded-full border-2 border-white bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:bottom-7 sm:right-7 sm:size-16"
    >
      <WhatsAppIcon className="size-8" />
    </a>
  );
}
