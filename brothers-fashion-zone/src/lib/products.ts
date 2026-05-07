import { supabase } from './supabase';
import { Product } from '@/types/product';
import { products as localProducts } from '@/data/products';

export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  original_price: number | null;
  discount_pct: number;
  images: string[];
  variants: Array<{ size: string; stock: number }>;
  colors: string[];
  tags: string[];
  total_stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

function mapSupabaseProduct(row: SupabaseProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    price: row.price,
    originalPrice: row.original_price || undefined,
    category: row.category,
    subcategory: row.subcategory || undefined,
    images: row.images,
    variants: row.variants,
    colors: row.colors,
    tags: row.tags,
    featured: row.is_featured,
    onSale: row.discount_pct > 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLocalToProduct(local: any): Product {
  return {
    id: local.id,
    name: local.name,
    slug: local.slug,
    description: local.description || '',
    price: local.price,
    originalPrice: local.originalPrice,
    category: local.category,
    subcategory: local.subcategory,
    images: local.images,
    variants: local.variants || [],
    colors: local.colors || [],
    tags: local.tags || [],
    featured: local.featured || false,
    onSale: local.onSale || false,
    createdAt: local.createdAt || new Date().toISOString(),
    updatedAt: local.updatedAt || new Date().toISOString(),
  };
}

async function trySupabase<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fn();
    if (Array.isArray(result) && result.length === 0) {
      return fallback;
    }
    return result;
  } catch (err) {
    console.warn('Supabase error, using local data:', err);
    return fallback;
  }
}

export async function getProductsFromSupabase(): Promise<Product[]> {
  return trySupabase(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) return localProducts.map(mapLocalToProduct);
    if (!data || data.length === 0) return localProducts.map(mapLocalToProduct);
    return data.map(mapSupabaseProduct);
  }, localProducts.map(mapLocalToProduct));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return trySupabase(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      const local = localProducts.find(p => p.slug === slug);
      return local ? mapLocalToProduct(local) : null;
    }
    return mapSupabaseProduct(data);
  }, localProducts.find(p => p.slug === slug) ? mapLocalToProduct(localProducts.find(p => p.slug === slug)) : null);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return trySupabase(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return localProducts
        .filter(p => p.category?.toLowerCase() === category.toLowerCase())
        .map(mapLocalToProduct);
    }
    if (!data || data.length === 0) {
      return localProducts
        .filter(p => p.category?.toLowerCase() === category.toLowerCase())
        .map(mapLocalToProduct);
    }
    return data.map(mapSupabaseProduct);
  }, localProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase()).map(mapLocalToProduct));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return trySupabase(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) return localProducts.filter(p => p.featured).slice(0, 8).map(mapLocalToProduct);
    if (!data || data.length === 0) return localProducts.filter(p => p.featured).slice(0, 8).map(mapLocalToProduct);
    return data.map(mapSupabaseProduct);
  }, localProducts.filter(p => p.featured).slice(0, 8).map(mapLocalToProduct));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const lowerQuery = query.toLowerCase();
  return trySupabase(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      return localProducts
        .filter(p => p.name?.toLowerCase().includes(lowerQuery) || p.description?.toLowerCase().includes(lowerQuery))
        .map(mapLocalToProduct);
    }
    if (!data || data.length === 0) {
      return localProducts
        .filter(p => p.name?.toLowerCase().includes(lowerQuery) || p.description?.toLowerCase().includes(lowerQuery))
        .map(mapLocalToProduct);
    }
    return data.map(mapSupabaseProduct);
  }, localProducts.filter(p => p.name?.toLowerCase().includes(lowerQuery) || p.description?.toLowerCase().includes(lowerQuery)).map(mapLocalToProduct));
}

export async function getRelatedProducts(productId: string, category: string): Promise<Product[]> {
  return trySupabase(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', productId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) {
      return localProducts
        .filter(p => p.category === category && p.id !== productId)
        .slice(0, 4)
        .map(mapLocalToProduct);
    }
    if (!data || data.length === 0) {
      return localProducts
        .filter(p => p.category === category && p.id !== productId)
        .slice(0, 4)
        .map(mapLocalToProduct);
    }
    return data.map(mapSupabaseProduct);
  }, localProducts.filter(p => p.category === category && p.id !== productId).slice(0, 4).map(mapLocalToProduct));
}