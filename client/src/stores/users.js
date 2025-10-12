import { create } from 'zustand';
import { api } from '../lib/api';

function qs(params = {}) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
}

export const useUsersStore = create((set, get) => ({
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
  totalPages: 0,
  q: '',
  role: '', // '', 'USER', 'ADMIN'

  listStatus: 'idle',
  listError: null,

  mutateStatus: 'idle',
  mutateError: null,

  setPage: (page) => set({ page: Math.max(1, Number(page) || 1) }),
  setPageSize: (ps) =>
    set({ pageSize: Math.min(50, Math.max(1, Number(ps) || 12)) }),
  setQ: (q) => set({ q }),
  setRoleFilter: (role) => set({ role }),

  async listUsers(opts = {}) {
    const st = get();
    const page = opts.page ?? st.page;
    const pageSize = opts.pageSize ?? st.pageSize;
    const q = opts.q ?? st.q;
    const role = opts.role ?? st.role;

    set({ listStatus: 'loading', listError: null });
    try {
      const data = await api.get(`/users${qs({ page, pageSize, q, role })}`);
      set({
        items: data.items ?? [],
        page: data.page ?? page,
        pageSize: data.pageSize ?? pageSize,
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 0,
        listStatus: 'success',
      });
    } catch (e) {
      set({
        listStatus: 'error',
        listError: e.message || 'Failed to load users',
      });
      throw e;
    }
  },

  async updateRole(id, role) {
    set({ mutateStatus: 'loading', mutateError: null });
    try {
      const user = await api.patch(`/users/${id}/role`, { role });
      set((s) => ({
        items: s.items.map((u) => (u.id === user.id ? user : u)),
        mutateStatus: 'success',
      }));
      return user;
    } catch (e) {
      set({
        mutateStatus: 'error',
        mutateError: e.message || 'Failed to update role',
      });
      throw e;
    }
  },
}));
