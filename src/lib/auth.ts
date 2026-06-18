import type { User } from "@/types/auth";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sam_token");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("sam_user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("sam_token");
  localStorage.removeItem("sam_user");
}