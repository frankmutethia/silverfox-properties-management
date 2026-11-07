// Shapes returned by the Silverfox API (see the backend README). Ids are MongoDB `_id`
// strings and dates are ISO strings.

export type PublicationStatus = "draft" | "published";
export type TestimonialStatus = "pending" | PublicationStatus;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** A list response with its items lifted out of the resource-specific key. */
export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

/** An image previously uploaded with POST /media, plus its alt text. */
export interface ApiImage {
  url: string;
  publicId?: string | undefined;
  alt: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface ApiUser {
  _id: string;
  name: string;
  /** Sign-in address. */
  email: string;
  contactEmail: string;
  phone: string;
  photo: ApiImage | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PropertyCategory = "sale" | "rent" | "managed";
export type PropertyType = "Apartment" | "House";

export interface PropertyPrice {
  amount: number;
  currency: string;
  period: "" | "month" | "year";
}

export interface PropertyImage extends ApiImage {
  /** CSS object-position, e.g. "50% 65%". */
  position?: string | null | undefined;
}

export interface ApiProperty {
  _id: string;
  name: string;
  slug: string;
  reference: string;
  category: PropertyCategory | null;
  type: PropertyType;
  location: string | null;
  neighbourhood: string | null;
  description: string;
  price: PropertyPrice | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  amenities: string[];
  images: PropertyImage[];
  status: PublicationStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyInput {
  name: string;
  reference: string;
  category?: PropertyCategory;
  type: PropertyType;
  location?: string;
  neighbourhood: string | null;
  description: string;
  price: PropertyPrice | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  amenities: string[];
  images: PropertyImage[];
  status?: PublicationStatus;
}

export type ServiceCategoryNumber = "01" | "02";

export interface ApiServiceCategory {
  _id: string;
  number: ServiceCategoryNumber;
  title: string;
  description: string;
  sortOrder: number;
}

export interface ApiService {
  _id: string;
  category: ServiceCategoryNumber;
  title: string;
  /** Sanitized HTML. */
  description: string;
  /** A lucide-react icon name. */
  icon: string | null;
  image: ApiImage | null;
  sortOrder: number;
  status: PublicationStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceGroup extends ApiServiceCategory {
  services: ApiService[];
}

export interface ServiceInput {
  category: ServiceCategoryNumber;
  title: string;
  description: string;
  icon: string | null;
  image: ApiImage | null;
  status?: PublicationStatus;
}

export interface ApiPost {
  _id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string;
  /** HTML body. Only present on single-post responses. */
  content?: string;
  coverImage: ApiImage | null;
  author: { _id: string; name: string } | null;
  status: PublicationStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostInput {
  title: string;
  content: string;
  category: string | null;
  excerpt: string | null;
  coverImage: ApiImage | null;
  status?: PublicationStatus;
}

export interface PublicTestimonial {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  publishedAt: string | null;
}

export interface ApiTestimonial extends PublicTestimonial {
  status: TestimonialStatus;
  source: "public" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialInput {
  name: string;
  comment: string;
  rating: number;
}

export interface Dashboard {
  properties: {
    total: number;
    published: number;
    draft: number;
    apartments: number;
    houses: number;
    byCategory: Record<PropertyCategory | "unconfirmed", number>;
  };
  services: Record<PublicationStatus, number>;
  blog: Record<PublicationStatus, number>;
  testimonials: Record<TestimonialStatus, number>;
  recent: {
    properties: Pick<
      ApiProperty,
      "_id" | "name" | "slug" | "reference" | "status" | "images" | "updatedAt"
    >[];
    posts: Pick<ApiPost, "_id" | "title" | "slug" | "status" | "updatedAt">[];
    pendingTestimonials: Pick<
      ApiTestimonial,
      "_id" | "name" | "rating" | "comment" | "createdAt"
    >[];
  };
}
