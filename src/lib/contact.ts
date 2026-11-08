export const tiktokUrl = "https://www.tiktok.com/@realestatewithfox";

export const instagramUrl = "https://www.instagram.com/silverfox_management/";

export function whatsappUrl(
  message = "Hello Silverfox, I would like to enquire about your properties and services.",
) {
  return `https://wa.me/254701507570?text=${encodeURIComponent(message)}`;
}
