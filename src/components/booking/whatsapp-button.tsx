"use client";

import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "2348079379510"; // +234 807 937 9510, no leading + or spaces for wa.me

export function WhatsAppButton({
  propertyTitle,
  location,
  iconOnly = false,
}: {
  propertyTitle: string;
  location: string;
  iconOnly?: boolean;
}) {
  const message = `Hi, I have a question about ${propertyTitle} (${location}).`;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Havyn Villa on WhatsApp about ${propertyTitle}`}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg bg-brand font-medium text-white shadow-sm transition-colors hover:bg-brand/90",
        iconOnly ? "size-11 shrink-0" : "mt-3 w-full px-4 py-2.5 text-sm",
      )}
    >
      <WhatsAppIcon size={iconOnly ? 20 : 18} />
      {!iconOnly && "Chat on WhatsApp"}
    </a>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.05 2C6.508 2 2 6.477 2 11.978c0 1.98.583 3.826 1.588 5.377L2 22l4.75-1.552a10.13 10.13 0 0 0 5.3 1.53h.004c5.542 0 10.05-4.477 10.05-9.978C22.104 6.5 17.6 2 12.05 2zm0 18.163a8.19 8.19 0 0 1-4.183-1.147l-.3-.178-3.115 1.018.99-3.033-.196-.311a8.13 8.13 0 0 1-1.252-4.334c0-4.494 3.664-8.147 8.06-8.147 2.153 0 4.177.838 5.7 2.36a8.06 8.06 0 0 1 2.36 5.706c0 4.494-3.665 8.147-8.064 8.147z" />
    </svg>
  );
}