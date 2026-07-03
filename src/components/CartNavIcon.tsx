"use client";

import { useCartStore } from "@/lib/store/cartStore";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { popScale } from "@/lib/animations";
import { useState, useEffect } from "react";

export default function CartNavIcon() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href="/cart" className="flex items-center justify-center p-3 text-gray-400 hover:text-gray-800 transition relative">
      <ShoppingCart className="w-6 h-6" />
      <AnimatePresence>
        {isMounted && totalItems > 0 && (
          <motion.span 
            key={totalItems} // Re-animate on count change
            variants={popScale}
            initial="initial"
            animate="animate"
            exit="initial"
            className="absolute top-1 right-1 w-4 h-4 bg-[#f46919] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
