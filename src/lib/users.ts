import { api, getAllPages } from "./api";
import type { ApiUser } from "./types";

/** Every staff account, oldest first. */
export const listUsers = (signal?: AbortSignal) =>
  getAllPages<ApiUser>("/users", "users", {}, signal);

export const createUser = (input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => api.post<{ user: ApiUser }>("/users", input).then((data) => data.user);
