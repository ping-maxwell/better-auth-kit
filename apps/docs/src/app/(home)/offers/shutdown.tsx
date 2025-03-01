"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const ShutdownOffer = ({ isHovering }: { isHovering: boolean }) => {
  return (
    <div
      className={cn(
        "w-full h-full select-none transition-opacity duration-150 ease-in-out overflow-hidden relative",
        !isHovering ? "opacity-90" : ""
      )}
    >
      <DoorBottom isHovering={isHovering} />
      <DoorTop isHovering={isHovering} />
      <motion.div
        className={cn(
          "w-full h-[300px] rounded-2xl bg-fd-card border border-fd-border py-5 px-2 absolute inset-0 drop-shadow-lg"
        )}
        initial={{ y: -60, scale: 0.4 }}
      >
        <Form isHovering={isHovering} />
      </motion.div>
    </div>
  );
};

function DoorTop({ isHovering }: { isHovering: boolean }) {
  return (
    <motion.div
      className="w-full h-[50%] bg-fd-muted absolute z-10 border-b-[3px] flex justify-center items-center"
      initial={{
        y: -150,
      }}
      animate={{
        y: isHovering ? 0 : -150,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <div className="absolute -bottom-[40px] w-[80px] h-[80px] rounded-full bg-fd-muted"></div>
      <div className="absolute -bottom-[40px] w-[80px] h-[80px] rounded-full bg-fd-border/20 border-3 flex justify-center items-center">
        <motion.div
          className={cn(
            "h-[40px] w-[10px] border rounded-sm transition-colors duration-300 ease-in-out delay-300",
            isHovering
              ? "border-red-500 bg-red-500/50"
              : "bg-fd-border/50 border-fd-border"
          )}
          initial={{
            rotate: 0,
          }}
          animate={{
            rotate: !isHovering ? 0 : 90,
          }}
          transition={{
            delay: 0.3,
          }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

function DoorBottom({ isHovering }: { isHovering: boolean }) {
  return (
    <motion.div
      className="w-full h-[50%] bg-fd-muted absolute z-10"
      initial={{
        y: 200,
      }}
      animate={{
        y: isHovering ? 90 : 200,
      }}
      transition={{
        duration: 0.3,
      }}
    ></motion.div>
  );
}

function Form({ isHovering }: { isHovering: boolean }) {
  return (
    <div className="w-full h-full flex flex-col gap-5 px-5">
      <div className="mt-[10px]"></div>
      <span className="text-center w-full flex justify-center items-center text-lg">
        Sign Up
      </span>
      <div className="w-full h-8 rounded-sm border-2 border-fd-border text-fd-muted-foreground px-2 flex justify-start items-center">
        Email
      </div>
      <div className="w-full h-8 rounded-sm border-2 border-fd-border text-fd-muted-foreground px-2 flex justify-start items-center">
        Password
      </div>
      <div className="mt-[5px]"></div>
      <div className="w-full text-center border border-fd-border py-1.5 rounded-md text-muted-foreground mt-2">
        Sign up!
      </div>
    </div>
  );
}
