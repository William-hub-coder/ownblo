"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type WarpTransitionProps = {
  children: ReactNode;
};

/**
 * Page transition with warp-stretch effect.
 * Wraps children in AnimatePresence keyed by pathname.
 */
export function WarpTransition({ children }: WarpTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scaleX: 0.98, filter: "blur(4px)" }}
        animate={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scaleX: 1.02, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
