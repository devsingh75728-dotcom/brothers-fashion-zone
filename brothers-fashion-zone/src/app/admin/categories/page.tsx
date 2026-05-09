'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const uploadCategoryImage = async (file: File, categoryId: string) => {
    if (!file) return;
    
    setUploading(categoryId);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path);
      
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: publicUrl })
        .eq('id', categoryId);
      
      if (updateError) throw updateError;
      
      toast.success('Image uploaded!');
      fetchCategories();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const toggleActive = async (category: Category) => {
    try {
      await supabase
        .from('categories')
        .update({ is_active: !category.is_active })
        .eq('id', category.id);
      
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const getCategoryEmoji = (name: string): string => {
    const emojis: Record<string, string> = {
      'Men': '👨',
      'Women': '👩',
      'Kids': '👶',
      'Footwear': '👟',
      'Watches': '⌚',
      'Bags': '👜',
      'Accessories': '💍',
      'Sale': '🏷️',
    };
    return emojis[name] || '📁';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-[24px] text-white">Categories</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden"
          >
            <div className="relative h-[120px] bg-[#0A0A0A]">
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                  <span className="text-4xl">{getCategoryEmoji(category.name)}</span>
                </div>
              )}
              
              <label className="absolute bottom-2 right-2 w-8 h-8 bg-[#C9B99A] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#B8A88A] transition-colors">
                <Camera size={14} className="text-[#0A0A0A]" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCategoryImage(file, category.id);
                  }}
                  disabled={uploading === category.id}
                />
              </label>
              
              {uploading === category.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <RefreshCw size={20} className="text-white animate-spin" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-inter text-[14px] text-white font-semibold">{category.name}</h3>
              <p className="font-mono text-[11px] text-white/40 mt-1">/{category.slug}</p>
              
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${category.is_active ? 'bg-[#39FF14]' : 'bg-gray-600'}`}
                  onClick={() => toggleActive(category)}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${category.is_active ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </div>
                <span className="text-[12px] text-white/60">{category.is_active ? 'Active' : 'Inactive'}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <p>No categories found. Run the SQL to create categories.</p>
        </div>
      )}
    </div>
  );
}