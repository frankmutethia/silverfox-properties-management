import type { Paginated, Pagination, UploadedImage } from "./types";

// Client for the Silverfox API. The session lives in an httpOnly cookie, so every
// request is sent with credentials and no token is ever read or stored in JS.

function apiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
}

export class ApiError extends Error {
  readonly status: number;
  /** Individual problems, usually formatted as "field: message". */
  readonly errors: string[];

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const NETWORK_MESSAGE =
  "Unable to reach the Silverfox server. Check your connection and try again.";

const statusMessages: Record<number, string> = {
  401: "Please sign in to continue.",
  403: "This action is not allowed.",
  404: "This item could not be found.",
  413: "This upload is too large.",
  429: "Too many requests. Please wait a moment and try again.",
  503: "This service is temporarily unavailable.",
};

export function toApiError(error: unknown): ApiError {
  return error instanceof ApiError ? error : new ApiError(0, NETWORK_MESSAGE);
}

let unauthorizedHandler: (() => void) | null = null;

/** Registers what happens when any request returns 401 (used by the staff workspace). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export type Query = Record<string, string | number | boolean | null | undefined>;

function buildUrl(path: string, query?: Query) {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new ApiError(0, "The API address (VITE_API_BASE_URL) is not configured.");
  const url = new URL(baseUrl + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface ApiResult<T> {
  data: T;
  message: string;
}

function readResponse<T>(status: number, body: unknown): ApiResult<T> {
  if (status >= 200 && status < 300 && isRecord(body) && body["success"] === true) {
    const message = body["message"];
    return { data: body["data"] as T, message: typeof message === "string" ? message : "" };
  }
  const rawMessage = isRecord(body) ? body["message"] : undefined;
  const rawErrors = isRecord(body) ? body["errors"] : undefined;
  const message =
    typeof rawMessage === "string" && rawMessage
      ? rawMessage
      : (statusMessages[status] ?? "Something went wrong. Please try again.");
  const errors = Array.isArray(rawErrors)
    ? rawErrors.filter((item): item is string => typeof item === "string")
    : [];
  if (status === 401) unauthorizedHandler?.();
  throw new ApiError(status, message, errors);
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  query?: Query | undefined;
  body?: unknown;
  signal?: AbortSignal | undefined;
}

export async function request<T>(
  method: Method,
  path: string,
  { query, body, signal }: RequestOptions = {},
): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      credentials: "include",
      headers:
        body === undefined
          ? { Accept: "application/json" }
          : { Accept: "application/json", "Content-Type": "application/json" },
      body: body === undefined ? null : JSON.stringify(body),
      signal: signal ?? null,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw toApiError(error);
  }
  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    // Non-JSON body (e.g. a proxy error page); readResponse falls back to the status.
  }
  return readResponse<T>(response.status, parsed);
}

export const api = {
  get: <T>(path: string, query?: Query, signal?: AbortSignal) =>
    request<T>("GET", path, { query, signal }).then((result) => result.data),
  post: <T>(path: string, body: unknown = {}) =>
    request<T>("POST", path, { body }).then((result) => result.data),
  patch: <T>(path: string, body: unknown = {}) =>
    request<T>("PATCH", path, { body }).then((result) => result.data),
  del: <T>(path: string) => request<T>("DELETE", path).then((result) => result.data),
};

/** Fetches one page of a list endpoint whose items are returned under `key`. */
export async function getPage<T>(
  path: string,
  key: string,
  query?: Query,
  signal?: AbortSignal,
): Promise<Paginated<T>> {
  const data = await api.get<Record<string, unknown>>(path, query, signal);
  return { items: (data[key] ?? []) as T[], pagination: data["pagination"] as Pagination };
}

/** Fetches every page of a list endpoint (100 per request, the API maximum). */
export async function getAllPages<T>(
  path: string,
  key: string,
  query: Query = {},
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page += 1) {
    const result = await getPage<T>(path, key, { ...query, page, limit: 100 }, signal);
    items.push(...result.items);
    if (page >= result.pagination.totalPages) return items;
  }
}

export const UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export type UploadFolder = "properties" | "services" | "blog" | "profile";

/** Returns a message when the file cannot be uploaded, otherwise null. */
export function imageFileProblem(file: File) {
  if (!UPLOAD_TYPES.includes(file.type)) return `${file.name}: choose a JPG, PNG or WebP image.`;
  if (file.size > MAX_UPLOAD_BYTES) return `${file.name}: images must be 5 MB or smaller.`;
  return null;
}

/** Uploads one image to POST /media, reporting progress from 0 to 100. */
export function upload(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<UploadedImage> {
  const problem = imageFileProblem(file);
  if (problem) return Promise.reject(new ApiError(400, problem));
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    try {
      xhr.open("POST", buildUrl("/media", { folder }));
    } catch (error) {
      reject(toApiError(error));
      return;
    }
    xhr.withCredentials = true;
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        resolve(readResponse<{ image: UploadedImage }>(xhr.status, xhr.response).data.image);
      } catch (error) {
        reject(toApiError(error));
      }
    };
    xhr.onerror = () => reject(new ApiError(0, NETWORK_MESSAGE));
    const form = new FormData();
    form.append("image", file);
    xhr.send(form);
  });
}

/** Splits API validation messages into `{ "field.path": message }` and general messages. */
export function splitErrors(error: ApiError) {
  const fields: Record<string, string> = {};
  const general: string[] = [];
  for (const entry of error.errors.length ? error.errors : [error.message]) {
    const match = /^([\w.]+): (.+)$/.exec(entry);
    if (match?.[1] && match[2]) fields[match[1]] ??= match[2];
    else general.push(entry);
  }
  return { fields, general };
}
