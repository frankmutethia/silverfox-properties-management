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

Deploy the generated `dist` directory to a static web host. Configure an
`index.html` fallback for `/properties/*` and unknown URLs so property pages
also work when opened directly or refreshed.
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
