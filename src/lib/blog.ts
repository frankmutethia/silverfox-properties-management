import { api, getPage, type Query } from "./api";
import type { ApiPost, PostInput } from "./types";

// The public site route is /blogs/:slug; the API resource is /blog.

export const ARTICLE_MAX_TEXT = 50_000;
export const ARTICLE_MAX_IMAGES = 5;

// ---------- Public ----------

export const listPublishedPosts = (query: Query, signal?: AbortSignal) =>
  getPage<ApiPost>("/blog", "posts", query, signal);

export const getPostBySlug = (slug: string, signal?: AbortSignal) =>
  api
    .get<{ post: ApiPost }>(`/blog/slug/${encodeURIComponent(slug)}`, {}, signal)
    .then((data) => data.post);

// ---------- Staff ----------

export const listAdminPosts = (query: Query, signal?: AbortSignal) =>
  getPage<ApiPost>("/blog/admin/all", "posts", query, signal);

export const getAdminPost = (id: string, signal?: AbortSignal) =>
  api.get<{ post: ApiPost }>(`/blog/admin/${id}`, {}, signal).then((data) => data.post);

export const createPost = (input: PostInput) =>
  api.post<{ post: ApiPost }>("/blog", input).then((data) => data.post);

export const updatePost = (id: string, input: Partial<PostInput>) =>
  api.patch<{ post: ApiPost }>(`/blog/${id}`, input).then((data) => data.post);

export const togglePostPublish = (id: string) =>
  api.patch<{ post: ApiPost }>(`/blog/${id}/publish`).then((data) => data.post);

export const deletePost = (id: string) => api.del<object>(`/blog/${id}`);
