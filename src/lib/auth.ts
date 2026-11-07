import { api, request } from "./api";
import type { ApiImage, ApiUser, Dashboard } from "./types";

export const PASSWORD_MIN_LENGTH = 10;

export const login = (email: string, password: string, remember: boolean) =>
  api.post<{ user: ApiUser }>("/auth/login", { email, password, remember }).then((d) => d.user);

export const logout = () => api.post<object>("/auth/logout");

/** The signed-in staff member; rejects with a 401 ApiError when signed out. */
export const getMe = (signal?: AbortSignal) =>
  api.get<{ user: ApiUser }>("/auth/me", {}, signal).then((data) => data.user);

export const updateProfile = (input: {
  name?: string;
  contactEmail?: string;
  phone?: string;
  photo?: ApiImage | null;
}) => api.patch<{ user: ApiUser }>("/auth/profile", input).then((data) => data.user);

export const changePassword = (input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => request<object>("PATCH", "/auth/change-password", { body: input }).then((r) => r.message);

/** Always resolves with the API's generic message unless email is unavailable (503). */
export const forgotPassword = (email: string) =>
  request<object>("POST", "/auth/forgot-password", { body: { email } }).then((r) => r.message);

export const resetPassword = (input: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => request<object>("POST", "/auth/reset-password", { body: input }).then((r) => r.message);

export const getDashboard = (signal?: AbortSignal) =>
  api.get<Dashboard>("/admin/dashboard", {}, signal);
