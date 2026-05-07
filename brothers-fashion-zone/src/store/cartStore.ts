import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  variant: {
    size: string;
    color?: string;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string, size: string) => Promise<void>;
  updateQuantity: (id: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const key = 'bfz_session_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const newId = crypto.randomUUID();
  localStorage.setItem(key, newId);
  return newId;
}

async function syncToSupabase(sessionId: string, items: CartItem[]): Promise<void> {
  try {
    await supabase
      .from('cart_sessions')
      .upsert(
        { session_id: sessionId, items, updated_at: new Date().toISOString() },
        { onConflict: 'session_id' }
      );
  } catch (error) {
    console.error('Error syncing cart to Supabase:', error);
  }
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : createJSONStorage(() => ({ getItem: () => null, setItem: () => {}, removeItem: () => {} }));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,

      hydrate: async () => {
        if (get().hydrated) return;
        if (typeof window === 'undefined') return;
        
        try {
          const sessionId = getSessionId();
          if (!sessionId) return;

          const { data, error } = await supabase
            .from('cart_sessions')
            .select('items')
            .eq('session_id', sessionId)
            .single();

          if (error) {
            set({ hydrated: true });
            return;
          }

          if (data?.items) {
            set({ items: data.items as CartItem[], hydrated: true });
          } else {
            set({ hydrated: true });
          }
        } catch (error) {
          console.error('Error hydrating cart:', error);
          set({ hydrated: true });
        }
      },

      addItem: async (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.id === item.id && i.variant.size === item.variant.size
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = items.map((i, idx) =>
            idx === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...items, item];
        }

        set({ items: newItems });

        const sessionId = getSessionId();
        if (sessionId) {
          await syncToSupabase(sessionId, newItems);
        }
      },

      removeItem: async (id, size) => {
        const newItems = get().items.filter(
          (item) => !(item.id === id && item.variant.size === size)
        );
        set({ items: newItems });

        const sessionId = getSessionId();
        if (sessionId) {
          await syncToSupabase(sessionId, newItems);
        }
      },

      updateQuantity: async (id, size, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id, size);
          return;
        }

        const newItems = get().items.map((item) =>
          item.id === id && item.variant.size === size
            ? { ...item, quantity }
            : item
        );
        set({ items: newItems });

        const sessionId = getSessionId();
        if (sessionId) {
          await syncToSupabase(sessionId, newItems);
        }
      },

      clearCart: async () => {
        set({ items: [] });

        const sessionId = getSessionId();
        if (sessionId) {
          await syncToSupabase(sessionId, []);
        }
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'bfz-cart-storage',
      storage,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
