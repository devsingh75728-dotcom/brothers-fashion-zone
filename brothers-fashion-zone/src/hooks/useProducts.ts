import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { products as localProducts } from '@/data/products';

export interface ProductFilters {
  category: string[];
  priceRange: [number, number];
  sizes: string[];
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  search?: string;
}

interface UseProductsOptions {
  filters?: Partial<ProductFilters>;
  limit?: number;
  category?: string;
}

function mapDbProductToProduct(row: Record<string, unknown>): Product {
  return {
    id: (row.id as string) || '',
    name: (row.name as string) || '',
    slug: (row.slug as string) || '',
    description: (row.description as string) || '',
    price: (row.price as number) || 0,
    originalPrice: (row.original_price as number) || undefined,
    category: (row.category as string) || '',
    subcategory: (row.subcategory as string) || undefined,
    images: Array.isArray(row.images) ? row.images as string[] : [],
    variants: Array.isArray(row.variants) ? row.variants as Product['variants'] : [],
    colors: Array.isArray(row.colors) ? row.colors as string[] : [],
    material: (row.material as string) || undefined,
    fit: (row.fit as string) || undefined,
    tags: Array.isArray(row.tags) ? row.tags as string[] : [],
    featured: (row.is_featured as boolean) || false,
    onSale: ((row.original_price as number) || 0) > (row.price as number),
    createdAt: (row.created_at as string) || new Date().toISOString(),
    updatedAt: (row.updated_at as string) || new Date().toISOString(),
  };
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalData, setUsingLocalData] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try Supabase first
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(50);

      if (fetchError) {
        console.warn('Supabase error, falling back to local data:', fetchError.message);
        // Fall back to local data
        setProducts(localProducts as Product[]);
        setUsingLocalData(true);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const mappedProducts = data.map(mapDbProductToProduct);
        setProducts(mappedProducts);
        setUsingLocalData(false);
      } else {
        // No products in DB, use local
        console.warn('No products in database, using local data');
        setProducts(localProducts as Product[]);
        setUsingLocalData(true);
      }
    } catch (err) {
      console.warn('Error fetching from Supabase, using local data:', err);
      // Fall back to local data on any error
      setProducts(localProducts as Product[]);
      setUsingLocalData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const filters = options.filters || {};

    if (filters.category && filters.category.length > 0) {
      result = result.filter((p) => filters.category!.includes(p.category));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.variants?.some((v) => filters.sizes!.includes(v.size))
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, options.filters]);

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    usingLocalData,
    refetch: fetchProducts,
  };
}