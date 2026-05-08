'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, CartItem } from '@/store/cartStore';
import { products } from '@/data/products';

const FILTERS = ['ALL', 'NEW', 'TRENDING', 'UNDER ₹999'] as const;
type FilterType = typeof FILTERS[number];

const VIEW_COUNTS = [488, 234, 156, 389, 271, 445, 198, 322];

const IMAGE_MAP: Record<string, string> = {
  'Royal Silk Kurta Set': '/images/fabric-collection.jpeg',
  'Classic Cotton Kurta': '/images/linen-collection.jpeg',
  'Festive Sherwani': '/images/classics-collection.jpeg',
  'Indo-Western Blazer': '/images/men-linen-shirts.jpeg',
  'Traditional Dhoti Set': '/images/fabric-collection.jpeg',
  'Linen Safari Kurta': '/images/linen-collection.jpeg',
  'Bandhani Leheriya': '/images/summer-linen-pants.jpeg',
  'Silk Embroidered Blouse': '/images/summer-linen-pants.jpeg',
};

const PRODUCT_CARDS = products.slice(0, 8).map((p, idx) => ({
  id: p.id || `prod_${idx}`,
  name: p.name || 'Product',
  slug: p.slug || p.id || `prod_${idx}`,
  price: p.price || 0,
  originalPrice: p.originalPrice,
  image: IMAGE_MAP[p.name] || p.images?.[0] || '/images/premium-basics.jpeg',
  badge: p.onSale ? 'SALE' : p.featured ? 'NEW' : null,
  discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
  views: VIEW_COUNTS[idx] || 200,
})).filter(p => p.slug && p.name);

interface ProductCardProps {
  product: typeof PRODUCT_CARDS[0];
  index: number;
  onAddToCart: (product: typeof PRODUCT_CARDS[0]) => void;
}

function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -8;
    const rotateY = (mouseX / (rect.width / 2)) * 8;
    
    setRotate({ 
      x: Math.max(-8, Math.min(8, rotateX)), 
      y: Math.max(-8, Math.min(8, rotateY)) 
    });
  }, []);

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success('Added to wishlist!');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 60, opacity: 0, scale: 0.95 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'none' : 'transform 400ms ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="bg-white border-2 border-black relative group cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-300"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/5] overflow-hidden relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.badge && (
            <div className={`absolute top-0 left-0 border-2 border-black px-2 py-1 ${
              product.badge === 'SALE' ? 'bg-pink-500' : 'bg-green-400'
            }`}>
              <span className="font-display font-black text-[11px] uppercase text-black">
                {product.badge === 'SALE' ? `-${product.discount}%` : product.badge}
              </span>
            </div>
          )}
          
          {/* Wishlist heart */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            onClick={handleWishlist}
            whileTap={{ scale: 1.5 }}
            className="absolute top-3 right-3 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center transition-all"
            style={{ color: isWishlisted ? '#FF2D6B' : '#0A0A0A' }}
          >
            <Heart size={18} fill={isWishlisted ? '#FF2D6B' : 'none'} />
          </motion.button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-3">
          <h3 className="font-display font-bold text-[13px] uppercase text-white truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="font-mono text-[12px] text-white/60 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className={`font-display font-black text-[16px] ${product.discount > 0 ? 'text-green-400' : 'text-white'}`}>
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-white/70">
              <Eye size={12} />
              <span className="font-mono text-[11px]">{product.views}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#FFD600' }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.preventDefault();
          onAddToCart(product);
        }}
        className="absolute top-3 left-3 w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:shadow-[2px_2px_0px_#0A0A0A] transition-all duration-200"
        aria-label="Add to cart"
      >
        <ShoppingCart size={18} className="text-black" />
      </motion.button>
    </motion.div>
  );
}

export function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const { addItem } = useCartStore();
  const [displayCount, setDisplayCount] = useState(8);

  const filteredProducts = PRODUCT_CARDS.filter((p) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'NEW') return p.badge === 'NEW';
    if (activeFilter === 'TRENDING') return p.views > 300;
    if (activeFilter === 'UNDER ₹999') return p.price < 999;
    return true;
  });

  const handleAddToCart = (product: typeof PRODUCT_CARDS[0]) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: { size: 'M' },
      quantity: 1,
    };
    addItem(cartItem);
    toast.success(`Added ${product.name} to cart! 🛍️`);
  };

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <section className="bg-[#F5F0E8] border-b-2 border-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-black">
            JUST DROPPED
          </h2>
          <Link href="/products" className="font-display font-bold text-[13px] uppercase text-black hover:text-purple-500 underline">
            VIEW ALL →
          </Link>
        </div>

        <div className="flex flex-wrap gap-0 mb-6">
          {FILTERS.map((filter, idx) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 text-[12px] font-display font-bold uppercase border-2 border-r-0 border-black transition-all duration-150 ${
                activeFilter === filter
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-yellow-400'
              } ${idx === FILTERS.length - 1 ? 'border-r-2' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
          {displayedProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {displayCount < filteredProducts.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setDisplayCount((p) => p + 4)}
              className="bg-transparent border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#0A0A0A] transition-all duration-200 h-14 px-12 font-display font-black text-[16px] uppercase text-black"
            >
              LOAD MORE HEAT ↓
            </button>
          </div>
        )}
      </div>
    </section>
  );
}