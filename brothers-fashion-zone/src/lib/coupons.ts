import { supabase } from './supabase';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  is_active: boolean;
  usage_count: number;
}

export interface ValidateCouponInput {
  code: string;
  subtotal: number;
}

export interface ValidateCouponResult {
  valid: boolean;
  discount: number;
  message: string;
  coupon?: Coupon;
}

export async function validateCoupon(input: ValidateCouponInput): Promise<ValidateCouponResult> {
  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', input.code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return {
        valid: false,
        discount: 0,
        message: 'Invalid coupon code',
      };
    }

    if (coupon.type === 'percentage') {
      const discount = (input.subtotal * coupon.value) / 100;
      return {
        valid: true,
        discount: Math.round(discount),
        message: `${coupon.value}% discount applied!`,
        coupon,
      };
    } else {
      const maxDiscount = Math.min(coupon.value, input.subtotal);
      return {
        valid: true,
        discount: maxDiscount,
        message: `₹${coupon.value} discount applied!`,
        coupon,
      };
    }
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      discount: 0,
      message: 'Failed to validate coupon',
    };
  }
}

export async function incrementCouponUsage(couponId: string): Promise<void> {
  try {
    await supabase
      .from('coupons')
      .update({ usage_count: supabase.rpc('increment', { x: 1 }) })
      .eq('id', couponId);
  } catch (error) {
    console.error('Error incrementing coupon usage:', error);
  }
}
