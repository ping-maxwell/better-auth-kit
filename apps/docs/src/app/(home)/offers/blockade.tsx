"use client";
import { motion, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import { CircleUser, User } from "lucide-react";

export const BlockadeOffer = ({ isHovering }: { isHovering: boolean }) => {
  //   const clear = useCallback(() => {}, []);

  //   const restartAnimation = useCallback(() => {
  //     clear();
  //   }, [clear]);

  //   useEffect(() => {
  //     if (isHovering) {
  //       restartAnimation();
  //     }

  //     return () => {
  //       clear();
  //     };
  //   }, [isHovering, clear, restartAnimation]);

  return (
    <div
      className={cn(
        "w-full h-full p-5 select-none transition-opacity duration-150 ease-in-out relative overflow-hidden",
        !isHovering && "opacity-90",
      )}
    >
      <UserCircle isHovering={isHovering} />
      <LineTop />
      <Line />
    </div>
  );
};

function Line() {
  return (
    <div className="w-full flex justify-center items-center absolute -bottom-[100px] left-0 h-[100px] px-5">
      <div className="rounded-full w-[80%] h-[300px] border border-fd-border/80"></div>
    </div>
  );
}
function LineTop() {
  return (
    <div className="w-full flex justify-center items-center absolute -top-[100px] left-0 h-[100px] px-5">
      <div className="absolute w-[350px] h-[200px] inset-0 bg-background"></div>
      <div className="rounded-full w-[80%] h-[300px] border border-fd-border/80"></div>
    </div>
  );
}

function UserCircle({ isHovering }: { isHovering: boolean }) {
  const [scope, animate] = useAnimate();
  const isDuringAnimation = useRef(false);
  const isHoveringRef = useRef(isHovering);

  const startAnimation = useCallback(() => {
    const userSuccess = Math.random() >= 0.4;
    //   const userSuccess = true
    let direction: [
      [number, number, number, number],
      [number, number, number, number],
    ] = [
      [220, 350, 430, 430],
      [50, 50, 150, 200],
    ];

    if (userSuccess) {
      direction = [
        [220, 340, 430, 430], // x
        [50, 50, -50, -200], // y
      ];
    }
    if (isDuringAnimation.current) return;
    isDuringAnimation.current = true;

    animate(
      scope.current,
      {
        x: [...[30, 30, 95, 220], ...direction[0]],
        y: [...[200, 150, 50, 50], ...direction[1]],
        filter: [
          "blur(5px)",
          "blur(3px)",
          "blur(0px)",
          "blur(0px)",
          "blur(0px)",
          "blur(0px)",
          "blur(3px)",
          "blur(5px)",
        ],
        boxShadow: [
          ...duplicateArrays(["0 0 10px 0px transparent"], 4),
          ...(userSuccess
            ? duplicateArrays(["0 0 10px 0px lime"], 4)
            : duplicateArrays(["0 0 10px 0px red"], 4)),
        ],
        color: [
          ...duplicateArrays(["var(--color-fd-muted-foreground)"], 4),
          ...(userSuccess
            ? duplicateArrays(["lime"], 4)
            : duplicateArrays(["red"], 4)),
        ],
      },
      {
        duration: 2.5,
        delay: 0,
        ease: "linear",
        onComplete() {
          isDuringAnimation.current = false;
          if (isHoveringRef.current === true) {
            startAnimation();
          }
        },
      },
    );
  }, [animate, scope.current]);

  useEffect(() => {
    isHoveringRef.current = isHovering;
    if (isHovering && !isDuringAnimation.current) {
      startAnimation();
    }
  }, [startAnimation, isHovering]);

  return (
    <motion.div
      initial={{
        y: 200,
        x: 35,
        filter: "blur(5px)",
      }}
      ref={scope}
      className="absolute rounded-full size-16 bg-fd-border z-10 flex justify-center items-center text-fd-muted-foreground"
    >
      <User className="size-8" />
    </motion.div>
  );
}

function duplicateArrays(arr: any[], duplicate: number) {
  const res = [];
  for (let i = 0; i < duplicate; i++) {
    res.push(arr);
  }
  return res;
}
