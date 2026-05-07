import { supabase } from '@/lib/supabase';

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

export interface CreateCouponInput {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  is_active?: boolean;
}

export interface UpdateCouponInput {
  type?: 'percentage' | 'fixed';
  value?: number;
  is_active?: boolean;
}

export async function createCoupon(input: CreateCouponInput): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('coupons').insert({
      code: input.code.toUpperCase(),
      type: input.type,
      value: input.value,
      is_active: input.is_active !== undefined ? input.is_active : true,
    });

    if (error) {
      console.error('Error creating coupon:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { success: false, error: 'Failed to create coupon' };
  }
}

export async function updateCoupon(id: string, input: UpdateCouponInput): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Record<string, unknown> = {};
    
    if (input.type !== undefined) updateData.type = input.type;
    if (input.value !== undefined) updateData.value = input.value;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;

    const { error } = await supabase
      .from('coupons')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating coupon:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating coupon:', error);
    return { success: false, error: 'Failed to update coupon' };
  }
}

export async function deleteCoupon(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting coupon:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return { success: false, error: 'Failed to delete coupon' };
  }
}

export async function getAllCoupons(): Promise<AdminCoupon[]> {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}
