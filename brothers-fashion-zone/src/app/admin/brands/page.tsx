'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase.from('brands').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      setBrands(data || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    await supabase.from('brands').delete().eq('id', id);
    setBrands(brands.filter((b) => b.id !== id));
    toast.success('Brand deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[24px] text-white">Brands</h2>
        <button className="flex items-center gap-2 bg-[#C9B99A] text-black font-inter text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-[#B8A88A] transition-colors">
          <Plus size={16} /> Add Brand
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#C9B99A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
          <p className="font-inter text-[14px] text-white/40">No brands yet</p>
          <p className="font-inter text-[12px] text-white/30 mt-2">Add your first brand to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden"
            >
              <div className="h-20 bg-[#0A0A0A] relative">
                {brand.banner_url && (
                  <img src={brand.banner_url} alt={brand.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4 relative -mt-6">
                <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border-2 border-[#2A2A2A] overflow-hidden flex items-center justify-center">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-inter text-[16px] text-white font-semibold">
                      {brand.name?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-inter text-[14px] text-white font-semibold mt-2">{brand.name}</h3>
                <p className="font-mono text-[11px] text-white/30 mt-1">/{brand.slug}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-2 h-2 rounded-full ${brand.is_active ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`} />
                  <span className="font-inter text-[11px] text-white/50">{brand.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-1.5 border border-[#2A2A2A] rounded text-[12px] text-white/60 hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors">
                    <Pencil size={12} className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => deleteBrand(brand.id)}
                    className="py-1.5 px-3 border border-[#2A2A2A] rounded text-[12px] text-white/60 hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}