'use client';

import { CartDrawer } from './CartDrawer'
import { useCartContext } from '@/components/providers/CartProvider'

export function CartDrawerWrapper() {
  const { drawerOpen, closeDrawer } = useCartContext()
  return <CartDrawer open={drawerOpen} onClose={closeDrawer} />
}
