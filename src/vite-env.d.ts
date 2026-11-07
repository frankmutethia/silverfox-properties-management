/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Silverfox API base URL including the version prefix, e.g. https://api.example.com/api/v1 */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
