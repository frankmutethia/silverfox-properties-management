export const tiktokUrl =
  "https://www.tiktok.com/@realestatewithfox/video/7575515468593663288?_r=1&_t=ZS-9B3z07gInhg";

export function whatsappUrl(
  message = "Hello Silverfox, I would like to enquire about your properties and services.",
) {
  return `https://wa.me/254701507570?text=${encodeURIComponent(message)}`;
}
