import { supabase } from '@/lib/supabase';

export interface AdminOrder {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    variant: { size: string; color?: string };
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total_amount: number;
  utr_number: string | null;
  coupon_used: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<AdminOrder | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

export async function updatePaymentStatus(
  orderId: string,
  status: 'pending' | 'paid' | 'failed'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating payment status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, payment_status, order_status');

    if (error) {
      console.error('Error fetching order stats:', error);
      return { totalOrders: 0, pendingOrders: 0, totalRevenue: 0 };
    }

    const orders = data || [];
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.order_status === 'placed' || o.order_status === 'processing').length,
      totalRevenue: orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0),
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return { totalOrders: 0, pendingOrders: 0, totalRevenue: 0 };
  }
}
