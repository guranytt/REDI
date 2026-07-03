"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2"
    >
      {products && products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </motion.div>
  );
}
