"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore, CartItem } from "@/lib/store/cartStore";

export default function AddToCartButton({ product }: { product: CartItem }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    addItem(product);
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={handleAdd}
      className="absolute bottom-3 right-3 bg-[#f46919] p-2.5 rounded-2xl text-white shadow-md z-10"
    >
      <ShoppingCart className="w-4 h-4" />
    </motion.button>
  );
}
