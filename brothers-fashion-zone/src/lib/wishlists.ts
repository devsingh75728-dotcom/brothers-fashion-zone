import { supabase } from './supabase';

export interface WishlistItem {
  id: string;
  session_id: string;
  product_ids: string[];
  updated_at: string;
}

export async function getWishlistBySession(sessionId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_ids')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return [];
    }

    return data.product_ids || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function syncWishlistToSupabase(sessionId: string, productIds: string[]): Promise<void> {
  try {
    await supabase
      .from('wishlists')
      .upsert(
        { session_id: sessionId, product_ids: productIds, updated_at: new Date().toISOString() },
        { onConflict: 'session_id' }
      );
  } catch (error) {
    console.error('Error syncing wishlist to Supabase:', error);
  }
}

export async function addToWishlist(sessionId: string, productId: string): Promise<string[]> {
  try {
    const current = await getWishlistBySession(sessionId);
    
    if (!current.includes(productId)) {
      const updated = [...current, productId];
      await syncWishlistToSupabase(sessionId, updated);
      return updated;
    }
    
    return current;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return [];
  }
}

export async function removeFromWishlist(sessionId: string, productId: string): Promise<string[]> {
  try {
    const current = await getWishlistBySession(sessionId);
    const updated = current.filter((id) => id !== productId);
    await syncWishlistToSupabase(sessionId, updated);
    return updated;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return [];
  }
}
