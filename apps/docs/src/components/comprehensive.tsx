"use client";
import { type ReactNode, useEffect, useState } from "react";
import { useComprehensive } from "./comprehensive-provider";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

export const Comprehensive = ({ children }: { children: ReactNode }) => {
  const { onChange } = useComprehensive();
  const [isShowing, setIsShowing] = useState(false);
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    const unsub = onChange((levelOfDetail) => {
      setIsShowing(levelOfDetail === "comprehensive");
    });
    return unsub;
  }, [onChange]);

  return (
    <motion.div
      animate={
        isShowing
          ? { opacity: 1, height: bounds.height, scale: 1 }
          : { opacity: 0, height: 0, scale: 0 }
      }
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};
