import { create } from 'zustand';
import { api } from '../lib/api';

const LS_KEY = 'velora-auth';

// učitavanje iz localStorage
function loadInitial() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { status: 'unauthenticated', user: null, token: null };
    const { user, token } = JSON.parse(raw);
    return {
      status: user ? 'authenticated' : 'unauthenticated',
      user,
      token: token || null,
    };
  } catch {
    return { status: 'unauthenticated', user: null, token: null };
  }
}

export const useAuthStore = create((set, get) => ({
  ...loadInitial(),

  // REGISTER -> backend vraća { user, token }
  async register(form) {
    set({ status: 'loading' });
    try {
      const { user, token } = await api.post('/auth/register', form);
      set({ user, token: token || null, status: 'authenticated' });
      return user;
    } catch (e) {
      set({ status: 'unauthenticated', user: null, token: null });
      throw e;
    }
  },

  // LOGIN -> backend vraća { user, token }
  async login(credentials) {
    set({ status: 'loading' });
    try {
      const { user, token } = await api.post('/auth/login', credentials);
      set({ user, token: token || null, status: 'authenticated' });
      return user;
    } catch (e) {
      set({ status: 'unauthenticated', user: null, token: null });
      throw e;
    }
  },

  // LOGOUT (poziva API i briše lokalno stanje)
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {}
    set({ status: 'unauthenticated', user: null, token: null });
  },

  // CHECK-AUTH (/auth/me) — koristi cookie sa servera
  async refresh() {
    const { status, user } = get();
    // ako već imamo user-a i authenticated, ne diramo
    if (status === 'authenticated' && user) return;
    set({ status: 'loading' });
    try {
      const me = await api.get('/auth/me');
      set({ user: me, status: 'authenticated' });
    } catch {
      set({ status: 'unauthenticated', user: null, token: null });
    }
  },

  // Helperi za druge API pozive sa opcionalnim Bearer tokenom
  async fetch(path, opts = {}) {
    const token = get().token;
    return api.get(path, { ...opts, token });
  },
  async mutate(path, method, body, opts = {}) {
    const token = get().token;
    const map = {
      POST: api.post,
      PUT: api.put,
      PATCH: api.patch,
      DELETE: api.del,
    };
    return map[method](path, body, { ...opts, token });
  },
}));

useAuthStore.subscribe((s) => {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ user: s.user, token: s.token || null })
    );
  } catch {}
});
