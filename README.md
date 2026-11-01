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
