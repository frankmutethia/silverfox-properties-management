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
`index.html` fallback to display the app's not-found screen for unknown URLs.
`npm run preview` serves the production build locally.

The browser entry is `src/main.tsx`, the application shell is `src/App.tsx`,
and the home page is `src/pages/Home.tsx`. The site renders in the browser;
there is no backend or server rendering. Contact links open an email client.
