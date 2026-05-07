import { supabase } from '@/lib/supabase';
import { SupabaseProduct } from '@/lib/products';

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  original_price?: number;
  discount_pct?: number;
  images: string[];
  variants: Array<{ size: string; stock: number }>;
  colors?: string[];
  tags?: string[];
  total_stock: number;
  is_featured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  is_active?: boolean;
}

export async function createProduct(input: CreateProductInput): Promise<{ success: boolean; error?: string }> {
  try {
    const discount_pct = input.discount_pct || 
      (input.original_price ? Math.round(((input.original_price - input.price) / input.original_price) * 100) : 0);

    const { error } = await supabase.from('products').insert({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      category: input.category,
      subcategory: input.subcategory || null,
      price: input.price,
      original_price: input.original_price || null,
      discount_pct,
      images: input.images,
      variants: input.variants,
      colors: input.colors || [],
      tags: input.tags || [],
      total_stock: input.total_stock,
      is_active: true,
      is_featured: input.is_featured || false,
    });

    if (error) {
      console.error('Error creating product:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.subcategory !== undefined) updateData.subcategory = input.subcategory;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.original_price !== undefined) updateData.original_price = input.original_price;
    if (input.discount_pct !== undefined) updateData.discount_pct = input.discount_pct;
    if (input.images !== undefined) updateData.images = input.images;
    if (input.variants !== undefined) updateData.variants = input.variants;
    if (input.colors !== undefined) updateData.colors = input.colors;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.total_stock !== undefined) updateData.total_stock = input.total_stock;
    if (input.is_active !== undefined) updateData.is_active = input.is_active;
    if (input.is_featured !== undefined) updateData.is_featured = input.is_featured;

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function getAllProductsForAdmin(): Promise<SupabaseProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch products from database:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Database unavailable, returning empty list');
    return [];
  }
}
