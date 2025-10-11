import { create } from 'zustand';
import { api } from '../lib/api';

// helper za query string (page, pageSize, q, category, sortBy, order)
function qs(params = {}) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
}

// objekat -> FormData (ako već nije FormData)
function toFormData(input = {}) {
  if (input instanceof FormData) return input;
  const fd = new FormData();
  Object.entries(input).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    // dozvoli File/Blob za "image", ostalo stringify
    if (k === 'image' && (v instanceof File || v instanceof Blob)) {
      fd.append('image', v);
    } else {
      fd.append(k, String(v));
    }
  });
  return fd;
}

export const useProductsStore = create((set, get) => ({
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
  totalPages: 0,
  q: '',
  category: '',
  sortBy: 'createdAt', //  'createdAt' | 'price' | 'name'
  order: 'desc', //  'asc' | 'desc'
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: null,

  // jedan proizvod
  current: null,
  currentStatus: 'idle',
  currentError: null,

  // admin akcije status
  adminStatus: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  adminError: null,

  // setters
  setQuery(q) {
    set({ q });
  },
  setPage(page) {
    set({ page: Math.max(1, Number(page) || 1) });
  },
  setPageSize(pageSize) {
    set({ pageSize: Math.min(50, Math.max(1, Number(pageSize) || 12)) });
  },
  setCategory(category) {
    set({ category: category || '' });
  },
  setSort(sortBy, order = 'desc') {
    const s = ['createdAt', 'price', 'name'].includes(sortBy)
      ? sortBy
      : 'createdAt';
    const o = order === 'asc' ? 'asc' : 'desc';
    set({ sortBy: s, order: o });
  },

  // PUBLIC: lista
  async fetchList(opts = {}) {
    const state = get();
    const page = opts.page ?? state.page;
    const pageSize = opts.pageSize ?? state.pageSize;
    const q = opts.q ?? state.q;
    const category = opts.category ?? state.category;
    const sortBy = opts.sortBy ?? state.sortBy;
    const order = opts.order ?? state.order;

    set({ status: 'loading', error: null });
    try {
      const data = await api.get(
        `/products${qs({ page, pageSize, q, category, sortBy, order })}`
      );
      set({
        items: data.items ?? [],
        page: data.page ?? page,
        pageSize: data.pageSize ?? pageSize,
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 0,
        status: 'success',
      });
      return data.items ?? [];
    } catch (e) {
      set({ status: 'error', error: e.message || 'Failed to fetch products' });
      throw e;
    }
  },

  // PUBLIC: jedan
  async fetchOne(id) {
    set({ currentStatus: 'loading', currentError: null });
    try {
      const product = await api.get(`/products/${id}`);
      set({ current: product, currentStatus: 'success' });
      return product;
    } catch (e) {
      set({
        currentStatus: 'error',
        currentError: e.message || 'Failed to fetch product',
      });
      throw e;
    }
  },

  clearCurrent() {
    set({ current: null, currentStatus: 'idle', currentError: null });
  },
  resetList() {
    set({
      items: [],
      page: 1,
      pageSize: 12,
      total: 0,
      totalPages: 0,
      q: '',
      category: '',
      sortBy: 'createdAt',
      order: 'desc',
      status: 'idle',
      error: null,
    });
  },

  // ===== ADMIN METODE =====
  // Create product (multipart/form-data)
  async createProduct(data) {
    set({ adminStatus: 'loading', adminError: null });
    try {
      const formData = toFormData(data);
      const product = await api.post('/products', formData);
      set((s) => ({ items: [product, ...s.items], adminStatus: 'success' }));
      return product;
    } catch (e) {
      set({
        adminStatus: 'error',
        adminError: e.message || 'Failed to create product',
      });
      throw e;
    }
  },

  // Update product (multipart/form-data)
  async updateProduct(id, data) {
    set({ adminStatus: 'loading', adminError: null });
    try {
      const formData = toFormData(data);
      const product = await api.put(`/products/${id}`, formData);
      set((s) => ({
        items: s.items.map((p) => (p.id === product.id ? product : p)),
        current: s.current?.id === product.id ? product : s.current,
        adminStatus: 'success',
      }));
      return product;
    } catch (e) {
      set({
        adminStatus: 'error',
        adminError: e.message || 'Failed to update product',
      });
      throw e;
    }
  },

  // Delete product
  async deleteProduct(id) {
    set({ adminStatus: 'loading', adminError: null });
    try {
      await api.del(`/products/${id}`);
      set((s) => ({
        items: s.items.filter((p) => p.id !== Number(id)),
        current: s.current?.id === Number(id) ? null : s.current,
        adminStatus: 'success',
      }));
      return true;
    } catch (e) {
      set({
        adminStatus: 'error',
        adminError: e.message || 'Failed to delete product',
      });
      throw e;
    }
  },
}));
