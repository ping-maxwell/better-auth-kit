"use client";
import { type ReactNode, useEffect, useState } from "react";
import { useComprehensive } from "./comprehensive-provider";

export const Comprehensive = ({ children }: { children: ReactNode }) => {
  const { onChange } = useComprehensive();
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    const unsub = onChange((levelOfDetail) => {
      setIsShowing(levelOfDetail === "comprehensive");
    });
    return unsub;
  }, [onChange]);

  return isShowing ? children : null;
};
