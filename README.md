# Silverfox Property Management

Standalone React 19 and TypeScript website built with Vite and Tailwind CSS.
Images and the Silverfox logo are stored in `src/assets` and bundled locally.

## Development

Use Node.js 22.12+ and npm.

```sh
npm install
npm run dev
```

## Validation

```sh
npm run typecheck
npm run lint
npm run build
```

## Deployment

Deploy the generated `dist` directory to a static web host. The root `vercel.json`
configures Vercel's `index.html` fallback for property pages and unknown URLs.
This lets React handle routing when a property is clicked, opened directly or
refreshed. Other static hosts need the same SPA fallback configured separately.
`npm run preview` serves the production build locally.

The browser entry is `src/main.tsx`, the application shell is `src/App.tsx`,
and the home page is `src/pages/Home.tsx`. The site renders in the browser;
there is no backend or server rendering. Contact links open an email client.

## Property Listings

### Admin fields and backend contract

The form and public listing components share `Property` in `src/data/properties.ts`.
Use these fields in the future API:

| Field                              | Admin input and public use                                                                                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`, `reference`, `slug`        | Required name and unique reference; generated detail URL slug. Enforce uniqueness server-side.                                                           |
| `category`                         | Required `sale`, `rent`, or `managed`, independent of building type. Used for category labels and filtering. Legacy records remain null until confirmed. |
| `type`                             | Apartment or House, displayed on cards and specifications.                                                                                               |
| `location`                         | Required area/location; used on cards, filters and detail pages.                                                                                         |
| `neighbourhood`                    | Optional landmarks, access and viewing directions for the neighbourhood section.                                                                         |
| `description`                      | Required overview; excerpt on cards and full text on details.                                                                                            |
| `price`                            | Optional amount, currency and period. Sale: total price with empty period. Rent: month/year. Managed: null, displayed as “Managed by Silverfox”.         |
| `bedrooms`, `bathrooms`, `areaSqm` | Optional nonnegative counts and floor area in square metres. Zero bedrooms means studio; null means unconfirmed.                                         |
| `amenities`                        | Array entered as comma-separated features; displayed on cards and in the amenities list.                                                                 |
| `images`                           | Required ordered photos with `src` and descriptive `alt`. First is the cover; all appear in the gallery.                                                 |

Creation currently saves browser-local drafts, not backend uploads or published
listings. Existing drafts receive null category and neighbourhood defaults. Public
pages still use the seed collection. A future backend should validate these fields,
store photos in media storage and return URLs, and serve approved records to both
public routes and the admin interface. Keep publication status separate from
category and keep private owner, tenant and agreement data out of public responses.
The prototype supports five photos of up to 600 KB each.

`src/data/properties.ts` contains the shared listing records. Add verified locations,
prices (amount, currency, period), sizes in square metres, room counts, amenities,
descriptions and locally imported images there. Unknown facts remain null and are
shown as awaiting confirmation. Do not associate interior photos with a property
unless that association is verified. Each property's `images` array powers its
gallery; additional photos automatically enable thumbnail and next/previous controls.

Property pages use `/properties/<slug>` URLs. Navigation uses native links,
including home-section anchors, so refresh, browser history and opening a new tab
work without an additional routing dependency.

## Staff workspace preview

## Public journal and testimonials

The landing page shows the journal immediately after services, followed by
testimonials. `src/data/articles.ts` contains three editorial starter articles,
with local photographs and full content at `/blogs/<slug>`. Admin drafts are not
automatically published; connect an approved-content API when the backend is ready.
Unknown article URLs use the standard 404 screen.

The testimonial form collects a name, feedback and a 1–5 star rating. No client
testimonials have been supplied, so the public section starts with an empty state.
The form saves visitor feedback as pending review under `silverfox-testimonials`.
The admin Testimonials page (`/admin/testimonials`, below Blogs in navigation)
lists pending, draft and published entries. Admins can review/edit feedback,
create testimonials as drafts or publish them, and unpublish entries back to
drafts. The landing page displays only published records. The previous
`silverfox-testimonial-preview` record is retained as a pending legacy submission.
This workflow is browser-local: publication affects this browser only, not other
visitors or devices. A backend must provide authenticated moderation, shared
submission storage and a published-only public API before production use.

### Staff tools

The blog modal supports title, optional cover image with alt text, and a rich
article editor with headings, lists, bold/italic/underline, font sizes and families,
undo/redo, inline image uploads, formatted HTML paste and clipboard image paste.
Each uploaded image is limited to 600 KB (JPG/PNG/WebP), with up to five inline
images plus one cover. Inline images have editable required alt text and removal
controls. Pasted HTTPS image URLs are retained and depend on the original host;
upload the image to retain a browser-local copy. Unsafe HTML and image sources
are stripped. Blog drafts use `format: "html"`, sanitized `body`, and optional
`cover: { src, alt }`; old plain-text drafts are escaped and preserved when read.
Storage failures keep the editor open. Backend integration still needs shared
media storage, server-side sanitization and publication controls.

`/admin/services` lists the shared website services and supports creating local
service drafts under either purchase or management. Each draft has a required
title, category and formatted description, plus an optional JPG/PNG/WebP image
(600 KB maximum) with required alternative text when supplied. The editor supports
bold, italic, underline, numbered/bullet lists, headings, font size and font family.
Descriptions are rebuilt with an allowlist of formatting before saving and when
reading local storage; pasted text is plain text. Drafts use
`silverfox-local-services`, survive reloads in the same browser, and are not yet
published or synchronized. Storage failures keep the form available for retry.
Future API integration should repeat validation and HTML sanitization server-side
and replace image data URLs with uploaded media URLs.

The public header links to `/staff/login`. The split-screen sign-in form accepts
any valid email and non-empty sample password and opens `/admin`. Credentials are
not verified, transmitted or stored. `/staff/forgot-password` provides an account
support link, not a reset-email service. These routes are an interface preview,
not an authentication or authorization boundary; admin URLs are publicly accessible.

The admin workspace has Dashboard, Properties and Blogs routes, a collapsible
desktop sidebar, a mobile navigation drawer, shared light/dark theme controls,
help, sidebar logout links and a profile menu. Logout returns to sign-in; there
is no server session to revoke yet. Properties reads the existing website collection
and browser-local records. Create property opens a modal for name, reference,
type, location, description, price/currency/period, room counts, area, amenities
and up to five local photos (JPG/PNG/WebP, up to 600 KB each). New records are
stored under `silverfox-local-properties`, included in dashboard totals and can
be viewed from the admin table. They are not published to the public website.
Blogs saves editable drafts under `silverfox-blog-drafts` in localStorage on the
current browser; drafts are not published or synchronized. The profile uses a
local illustrated placeholder avatar. Connect server-backed authentication and
authorization before adding privileged operations or private data.
