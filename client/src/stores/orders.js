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

export const useOrdersStore = create((set, get) => ({
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
  totalPages: 0,
  statusFilter: '',
  listStatus: 'idle',
  listError: null,

  current: null,
  currentStatus: 'idle',
  currentError: null,

  mutateStatus: 'idle',
  mutateError: null,

  setPage(n) {
    set({ page: Math.max(1, Number(n) || 1) });
  },
  setPageSize(n) {
    set({ pageSize: Math.min(50, Math.max(1, Number(n) || 12)) });
  },
  setStatusFilter(s) {
    set({ statusFilter: s || '' });
  },

  async listOrders(opts = {}) {
    const state = get();
    const page = opts.page ?? state.page;
    const pageSize = opts.pageSize ?? state.pageSize;
    const status = opts.status ?? state.statusFilter;

    set({ listStatus: 'loading', listError: null });
    try {
      const data = await api.get(`/orders${qs({ page, pageSize, status })}`);
      set({
        items: data.items ?? [],
        page: data.page ?? page,
        pageSize: data.pageSize ?? pageSize,
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 0,
        listStatus: 'success',
      });
      return data.items ?? [];
    } catch (e) {
      set({
        listStatus: 'error',
        listError: e.message || 'Failed to fetch orders',
      });
      throw e;
    }
  },

  async getOrder(id) {
    set({ currentStatus: 'loading', currentError: null });
    try {
      const order = await api.get(`/orders/${id}`);
      set({ current: order, currentStatus: 'success' });
      return order;
    } catch (e) {
      set({
        currentStatus: 'error',
        currentError: e.message || 'Failed to fetch order',
      });
      throw e;
    }
  },

  async createOrder(payload) {
    set({ mutateStatus: 'loading', mutateError: null });
    try {
      const order = await api.post('/orders', payload);
      set({ mutateStatus: 'success' });
      return order;
    } catch (e) {
      set({
        mutateStatus: 'error',
        mutateError: e.message || 'Failed to create order',
      });
      throw e;
    }
  },

  async cancelOrder(id) {
    set({ mutateStatus: 'loading', mutateError: null });
    try {
      const order = await api.post(`/orders/${id}/cancel`, {});
      set((s) => ({
        mutateStatus: 'success',
        current: s.current?.id === order.id ? order : s.current,
        items: s.items.map((o) => (o.id === order.id ? order : o)),
      }));
      return order;
    } catch (e) {
      set({
        mutateStatus: 'error',
        mutateError: e.message || 'Failed to cancel order',
      });
      throw e;
    }
  },

  // ADMIN
  async updateStatus(id, status) {
    set({ mutateStatus: 'loading', mutateError: null });
    try {
      const order = await api.patch(`/orders/${id}/status`, { status });
      set((s) => ({
        mutateStatus: 'success',
        current: s.current?.id === order.id ? order : s.current,
        items: s.items.map((o) => (o.id === order.id ? order : o)),
      }));
      return order;
    } catch (e) {
      set({
        mutateStatus: 'error',
        mutateError: e.message || 'Failed to update status',
      });
      throw e;
    }
  },

  clearCurrent() {
    set({ current: null, currentStatus: 'idle', currentError: null });
  },
}));
