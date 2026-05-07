'use client';

import { useState, useRef, useCallback } from 'react';
import { X, UploadCloud, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: any;
}

const categories = [
  { value: 'clothing_men', label: 'Men\'s Clothing' },
  { value: 'clothing_women', label: 'Women\'s Clothing' },
  { value: 'footwear_men', label: 'Men\'s Footwear' },
  { value: 'footwear_women', label: 'Women\'s Footwear' },
  { value: 'watches', label: 'Watches' },
  { value: 'bags', label: 'Bags' },
  { value: 'accessories', label: 'Accessories' },
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export function ProductFormModal({ isOpen, onClose, onSuccess, editProduct }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editProduct?.name || '',
    slug: editProduct?.slug || '',
    category: editProduct?.category || 'clothing_men',
    price: editProduct?.price || '',
    original_price: editProduct?.original_price || '',
    description: editProduct?.description || '',
    images: editProduct?.images || [] as string[],
    variants: editProduct?.variants || [{ size: 'M', stock: 10 }],
    colors: editProduct?.colors || [] as string[],
    is_featured: editProduct?.is_featured || false,
    is_active: editProduct?.is_active !== false,
  });
  const [colorInput, setColorInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: formData.slug || generateSlug(name) });
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (formData.images.length + newImages.length >= 6) break;
      
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(imageData);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
    setUploading(false);
  }, [formData.images]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_img: string, i: number) => i !== index) });
  };

  const addVariant = () => {
    setFormData({ ...formData, variants: [...formData.variants, { size: 'M', stock: 10 }] });
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const removeVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_v: any, i: number) => i !== index) });
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput.trim()] });
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors.filter((c: string) => c !== color) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      const discount_pct = formData.original_price 
        ? Math.round(((parseFloat(formData.original_price) - parseFloat(formData.price)) / parseFloat(formData.original_price)) * 100)
        : 0;

      const total_stock = formData.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);

      const productData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        category: formData.category,
        subcategory: null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discount_pct,
        description: formData.description || null,
        images: formData.images,
        variants: formData.variants,
        colors: formData.colors,
        tags: [],
        total_stock,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      if (editProduct?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editProduct.id);
        
        if (error) throw error;
        toast.success('Product updated!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw error;
        toast.success('Product added successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#111111] border-l border-[#1A1A1A] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A] sticky top-0 bg-[#111111] z-10">
          <h2 className="font-display font-semibold text-2xl text-white">
            {editProduct ? 'Edit Product' : 'Add Product'}
          </h2>
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 pb-32">
          {/* Product Name */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Classic Cotton Kurta"
              className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none focus:ring-2 focus:ring-[rgba(201,185,154,0.1)]"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. classic-cotton-kurta"
              className="w-full h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-[13px] text-white/80 font-mono focus:border-[#C9B99A] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#0A0A0A]">{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-inter text-sm">₹</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg pl-8 pr-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Original Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-inter text-sm">₹</span>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  placeholder="0"
                  className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg pl-8 pr-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
              rows={3}
              className="w-full bg-[#0A0A0A] border border-[#222] rounded-lg p-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Product Images (max 6)</label>
            
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#C9B99A'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = '#222'; }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#222] rounded-xl bg-[#0A0A0A] p-8 text-center cursor-pointer hover:border-[#C9B99A] transition-colors"
            >
              <UploadCloud size={32} className="mx-auto text-white/20" />
              <p className="text-white/40 font-inter text-sm mt-2">Drop images here</p>
              <p className="text-white/25 font-inter text-xs mt-1">or tap to browse from gallery</p>
              <p className="text-white/20 font-inter text-[11px] mt-2">JPG, PNG, WEBP • Max 5MB each</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {formData.images.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#222]">
                    <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Size & Stock */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Size & Stock</label>
            <div className="space-y-2">
              {formData.variants.map((variant: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={variant.size}
                    onChange={(e) => updateVariant(i, 'size', e.target.value)}
                    className="h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  >
                    {sizeOptions.map(s => <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>)}
                  </select>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                    placeholder="Stock"
                    className="flex-1 h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
                  />
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addVariant} className="flex items-center gap-1 text-[#C9B99A] text-sm font-inter">
                <Plus size={14} /> Add Size
              </button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-[12px] text-white/50 uppercase tracking-wider mb-2 font-inter">Colors</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.colors.map((color: string) => (
                <span key={color} className="flex items-center gap-1 bg-[#1A1A1A] px-2 py-1 rounded text-white text-sm font-inter">
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: color }} />
                  {color}
                  <button type="button" onClick={() => removeColor(color)} className="text-white/40 hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                placeholder="Add color..."
                className="flex-1 h-10 bg-[#0A0A0A] border border-[#222] rounded-lg px-3 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
              />
              <button type="button" onClick={addColor} className="h-10 px-4 bg-[#1A1A1A] border border-[#222] rounded-lg text-white font-inter text-sm hover:border-[#C9B99A]">
                Add
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-[#222] bg-[#0A0A0A] text-[#C9B99A] focus:ring-[#C9B99A]"
              />
              <span className="text-white font-inter text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-[#222] bg-[#0A0A0A] text-green-500 focus:ring-green-500"
              />
              <span className="text-white font-inter text-sm">Active</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full h-[52px] bg-[#C9B99A] text-[#0A0A0A] font-inter font-semibold text-[15px] rounded-xl hover:bg-[#B8A88A] disabled:opacity-60 transition-all"
          >
            {loading ? 'Saving...' : uploading ? 'Uploading images...' : 'Save Product'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}