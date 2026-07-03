"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
