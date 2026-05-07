'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import gsap from 'gsap';

const FREE_SHIPPING_THRESHOLD = 599;
const SHIPPING_COST = 49;
const PLATFORM_FEE = 10;

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone'),
  email: z.string().email('Enter valid email'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  landmark: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { num: 1, label: 'CART' },
    { num: 2, label: 'DETAILS' },
    { num: 3, label: 'PAYMENT' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center gap-2">
          <div className="relative">
            {step.num < current ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-[#39FF14] border-2 border-black flex items-center justify-center"
              >
                <Check size={18} className="text-black" />
              </motion.div>
            ) : step.num === current ? (
              <div className="w-10 h-10 rounded-full bg-black border-2 border-black flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-6 rounded-full bg-white"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                <span className="font-display font-bold text-[14px] text-gray-400">{step.num}</span>
              </div>
            )}
          </div>
          <span className={`font-display font-bold text-[12px] uppercase ${step.num <= current ? 'text-black' : 'text-gray-400'}`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-200 ml-2">
              <motion.div
                className="h-full bg-[#39FF14]"
                initial={{ width: '0%' }}
                animate={{ width: step.num < current ? '100%' : '0%' }}
                transition={{ duration: 0.6 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FloatingLabelInput({
  label,
  register,
  error,
  type = 'text',
  prefix,
}: {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  type?: string;
  prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <label
        className={`absolute left-3 transition-all duration-200 pointer-events-none font-inter ${
          prefix ? 'left-12' : 'left-4'
        } ${focused || filled ? 'top-2 text-[11px]' : 'top-4 text-[14px]'} ${error ? 'text-red-500' : focused || filled ? 'text-[#C9B99A]' : 'text-gray-400'
        }`}
      >
        {label}
      </label>
      {prefix && (
        <span className="absolute left-3 top-4 font-mono text-[14px] text-gray-600 bg-gray-100 px-2 py-1 border-r border-gray-200">
          {prefix}
        </span>
      )}
      <input
        type={type}
        {...register}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setFilled(e.target.value.length > 0);
        }}
        className={`w-full h-14 px-4 border-2 bg-white font-inter text-[14px] focus:outline-none transition-all ${
          prefix ? 'pl-20' : ''
        } ${
          error
            ? 'border-red-500 shadow-[4px_4px_0px_#DC2626]'
            : focused
            ? 'border-[#6B5CE7] shadow-[4px_4px_0px_#6B5CE7]'
            : 'border-gray-200 shadow-[2px_2px_0px_#0A0A0A]'
        }`}
        ref={inputRef}
      />
      <AnimatePresence>
        {!error && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: focused || filled ? 1 : 0, scale: focused || filled ? 1 : 0 }}
            className="absolute right-4 top-4 text-green-500"
          >
            <Check size={18} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-1 mt-1 text-red-500"
          >
            <AlertCircle size={12} />
            <span className="font-inter text-[12px]">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping + PLATFORM_FEE;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutFormData) => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bfz_checkout', JSON.stringify({
        ...data,
        subtotal,
        shipping,
        total,
        itemCount: items.length,
      }));
    }
    setTimeout(() => {
      router.push('/checkout/payment');
    }, 500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-3xl mb-4">YOUR CART IS EMPTY</h1>
          <Link href="/products" className="underline font-inter">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <StepIndicator current={2} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-[#FFD600] border-2 border-black shadow-[4px_4px_0px_#0A0A0A] p-6">
                <h2 className="font-display font-black text-[24px] mb-6 flex items-center gap-2">
                  DELIVERY TO
                  <span>📦</span>
                </h2>

                <div className="space-y-4">
                  <FloatingLabelInput
                    label="Full Name"
                    register={register('fullName')}
                    error={errors.fullName?.message}
                  />

                  <div className="flex gap-4">
                    <div className="w-24">
                      <input
                        type="text"
                        value="+91"
                        readOnly
                        className="w-full h-14 px-4 border-2 border-gray-200 bg-gray-100 font-mono text-[14px]"
                      />
                    </div>
                    <div className="flex-1">
                      <FloatingLabelInput
                        label="Phone Number"
                        register={register('phone')}
                        error={errors.phone?.message}
                        type="tel"
                      />
                    </div>
                  </div>

                  <FloatingLabelInput
                    label="Email Address"
                    register={register('email')}
                    error={errors.email?.message}
                    type="email"
                  />

                  <FloatingLabelInput
                    label="Address Line"
                    register={register('address')}
                    error={errors.address?.message}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FloatingLabelInput
                      label="City"
                      register={register('city')}
                      error={errors.city?.message}
                    />
                    <FloatingLabelInput
                      label="State"
                      register={register('state')}
                      error={errors.state?.message}
                    />
                  </div>

                  <FloatingLabelInput
                    label="Pincode"
                    register={register('pincode')}
                    error={errors.pincode?.message}
                    type="text"
                  />

                  <FloatingLabelInput
                    label="Landmark (Optional)"
                    register={register('landmark')}
                    error={undefined}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full h-14 bg-black border-2 border-black shadow-[4px_4px_0px_#0A0A0A] font-display font-black text-[16px] uppercase text-white hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'SAVING...' : 'PROCEED TO PAYMENT →'}
              </motion.button>
            </motion.form>
          </div>

          <div className="lg:col-span-2">
            <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#0A0A0A] sticky top-24">
              <div className="p-6">
                <h2 className="font-display font-black text-[24px] mb-6">ORDER SUMMARY</h2>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant.size}`} className="flex gap-3">
                      <div className="relative w-16 h-16 border-2 border-black flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#6B5CE7] text-white text-[10px] font-display font-bold flex items-center justify-center border border-black">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[13px] uppercase truncate">{item.name}</p>
                        <p className="font-mono text-[11px] text-gray-500">{item.variant.size}</p>
                      </div>
                      <span className="font-mono text-[14px]">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-dashed border-black my-4" />

                <div className="space-y-2 font-mono text-[14px]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-[#39FF14] font-bold">FREE</span>
                    ) : (
                      <span>₹{shipping}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{PLATFORM_FEE}</span>
                  </div>
                </div>

                <div className="border-t-2 border-black mt-4 pt-4 flex justify-between">
                  <span className="font-display font-black text-[20px]">TOTAL</span>
                  <span className="font-display font-black text-[24px]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-[#F5F5F3] border-t-2 border-black p-4">
                <div className="flex items-center gap-2 text-[12px] font-inter text-gray-600">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                  <span className="mx-2">•</span>
                  <span>256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}