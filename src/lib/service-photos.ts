import buildingFacade from "@/assets/services/building-facade.jpg";
import greenResidence from "@/assets/services/green-residence.jpg";
import realEstate from "@/assets/precondo-ca-QHDFm084RNk-unsplash.jpg";
import keys from "@/assets/jakub-zerdzicki-bqUZEAeWuok-unsplash.jpg";
import kitchen from "@/assets/aaron-huber-G7sE2S4Lab4-unsplash.jpg";
import cityLiving from "@/assets/infinite-views-79NjpXDOJU8-unsplash.jpg";
import livingRoom from "@/assets/spacejoy-IH7wPsjwomc-unsplash.jpg";
import type { ApiService } from "./types";

// Services without an uploaded photo get a fitting site photo. Each service first gets the
// photo matching its icon; the rest get an unused photo, and if every photo is taken, the one
// used furthest away in the list, so neighbouring cards never share a picture. The landing
// page and the service page both use this, so a service shows the same photo on each.
const PHOTOS = [buildingFacade, realEstate, greenResidence, keys, livingRoom, kitchen, cityLiving];
const PHOTO_FOR_ICON: Record<string, string> = {
  Search: buildingFacade,
  FileCheck2: realEstate,
  Handshake: cityLiving,
  KeyRound: keys,
  ShieldCheck: livingRoom,
  Building2: greenResidence,
  Wrench: kitchen,
};

export type ServiceWithPhoto = { service: ApiService; photo: string; uploaded: boolean };

export function withPhotos(services: ApiService[]): ServiceWithPhoto[] {
  const photos: (string | undefined)[] = services.map((service) => service.image?.url);
  const usedAt = new Map<string, number>();
  services.forEach((service, index) => {
    const match = service.icon ? PHOTO_FOR_ICON[service.icon] : undefined;
    if (!photos[index] && match && !usedAt.has(match)) {
      photos[index] = match;
      usedAt.set(match, index);
    }
  });
  services.forEach((_, index) => {
    if (photos[index]) return;
    const photo =
      PHOTOS.find((candidate) => !usedAt.has(candidate)) ??
      [...PHOTOS].sort(
        (a, b) => Math.abs(index - (usedAt.get(b) ?? 0)) - Math.abs(index - (usedAt.get(a) ?? 0)),
      )[0]!;
    photos[index] = photo;
    usedAt.set(photo, index);
  });
  return services.map((service, index) => ({
    service,
    photo: photos[index]!,
    uploaded: Boolean(service.image),
  }));
}
