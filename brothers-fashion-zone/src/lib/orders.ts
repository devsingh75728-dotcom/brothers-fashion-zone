import { supabase } from './supabase';

export interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
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
  }>;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total_amount: number;
  utr_number?: string;
  coupon_used?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  order_status?: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BFZ-${new Date().getFullYear()}-${timestamp}${random}`;
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  try {
    const order_id = generateOrderId();

    const orderData = {
      order_id,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      customer_email: input.customer_email || null,
      delivery_address: input.delivery_address,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      items: input.items,
      subtotal: input.subtotal,
      discount: input.discount || 0,
      delivery_charge: input.delivery_charge || 0,
      total_amount: input.total_amount,
      utr_number: input.utr_number || null,
      coupon_used: input.coupon_used || null,
      payment_status: input.payment_status || 'pending',
      order_status: input.order_status || 'placed',
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select('order_id')
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }

    return data.order_id as string;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}
