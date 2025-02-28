"use client";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";

export const BlockadeOffer = ({ isHovering }: { isHovering: boolean }) => {
  const clear = useCallback(() => {}, []);

  const restartAnimation = useCallback(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (isHovering) {
      restartAnimation();
    }

    return () => {
      clear();
    };
  }, [isHovering, clear, restartAnimation]);

  return (
    <div
      className={cn(
        "w-full h-full p-5 select-none transition-opacity duration-150 ease-in-out",
        !isHovering && "opacity-90"
      )}
    ></div>
  );
};
