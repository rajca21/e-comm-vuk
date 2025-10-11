import { create } from 'zustand';

const LS_KEY = 'velora-cart';

function loadInitial() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) return { items: [] };
    return { items: parsed.items };
  } catch {
    return { items: [] };
  }
}

export const useCartStore = create((set, get) => ({
  ...loadInitial(), // { items: [...] }

  count: () => get().items.reduce((sum, it) => sum + it.quantity, 0),
  subtotal: () =>
    get().items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0),

  add(product, qty = 1) {
    const id = Number(product.id);
    const stock = Number(product.stock ?? 999999);
    const existing = get().items.find((i) => i.id === id);
    const nextQty = Math.max(
      1,
      Math.min(stock, (existing?.quantity || 0) + qty)
    );
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, quantity: nextQty } : i
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl || null,
            stock,
            quantity: Math.max(1, Math.min(stock, qty)),
          },
        ],
      });
    }
  },

  setQty(id, qty) {
    const stock = get().items.find((i) => i.id === Number(id))?.stock ?? 999999;
    const q = Math.max(1, Math.min(stock, Number(qty) || 1));
    set({
      items: get().items.map((i) =>
        i.id === Number(id) ? { ...i, quantity: q } : i
      ),
    });
  },

  inc(id) {
    const it = get().items.find((i) => i.id === Number(id));
    if (!it) return;
    const next = Math.min(it.stock ?? 999999, it.quantity + 1);
    set({
      items: get().items.map((i) =>
        i.id === it.id ? { ...i, quantity: next } : i
      ),
    });
  },

  dec(id) {
    const it = get().items.find((i) => i.id === Number(id));
    if (!it) return;
    const next = Math.max(1, it.quantity - 1);
    set({
      items: get().items.map((i) =>
        i.id === it.id ? { ...i, quantity: next } : i
      ),
    });
  },

  remove(id) {
    set({ items: get().items.filter((i) => i.id !== Number(id)) });
  },

  clear() {
    set({ items: [] });
  },
}));

// persist u localStorage
useCartStore.subscribe((state) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ items: state.items }));
  } catch {}
});
