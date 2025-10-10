import { create } from "zustand";
import { api } from "../lib/api";

const LS_KEY = "velora-auth";

function loadInitial() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { status: "unauthenticated", user: null, token: null };
    const parsed = JSON.parse(raw);
    return {
      status: parsed?.token ? "authenticated" : "unauthenticated",
      user: parsed?.user ?? null,
      token: parsed?.token ?? null,
    };
  } catch {
    return { status: "unauthenticated", user: null, token: null };
  }
}

export const useAuthStore = create((set, get) => ({
  ...loadInitial(),

  async login(credentials, { mock = true } = {}) {
    set({ status: "loading" });
    try {
      let payload;
      if (mock) {
        await new Promise((r) => setTimeout(r, 400));
        payload = {
          token: "dev-token-123",
          user: { id: 1, email: credentials.email, name: "Dev User" },
        };
      } else {
        payload = await api.post("/auth/login", credentials);
      }
      set({ token: payload.token, user: payload.user, status: "authenticated" });
      return payload.user;
    } catch (e) {
      set({ status: "unauthenticated", token: null, user: null });
      throw e;
    }
  },

  async logout({ callApi = false } = {}) {
    const token = get().token;
    if (callApi && token) {
      try { await api.post("/auth/logout", null, { token }); } catch (_) {}
    }
    set({ status: "unauthenticated", token: null, user: null });
  },

  async refresh() {
    const token = get().token;
    if (!token) return set({ status: "unauthenticated", user: null });
    set({ status: "loading" });
    try {
      const me = await api.get("/auth/me", { token });
      set({ user: me, status: "authenticated" });
    } catch {
      set({ status: "unauthenticated", token: null, user: null });
    }
  },

  async fetch(path, opts = {}) {
    const token = get().token;
    return api.get(path, { ...opts, token });
  },
  async mutate(path, method, body, opts = {}) {
    const token = get().token;
    const map = { POST: api.post, PUT: api.put, PATCH: api.patch, DELETE: api.del };
    return map[method](path, body, { ...opts, token });
  },
}));

useAuthStore.subscribe((s) => {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ user: s.user, token: s.token })
    );
  } catch {}
});
