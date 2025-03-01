"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const LegalConsentOffer = ({ isHovering }: { isHovering: boolean }) => {
  // const clear = useCallback(() => {
  // }, []);

  // const restartAnimation = useCallback(() => {
  //   clear();
  // }, [clear]);

  // useEffect(() => {
  //   if (isHovering) {
  //     restartAnimation();
  //   } else {
  //     clear();
  //   }

  //   return () => {
  //     clear();
  //   };
  // }, [isHovering, clear, restartAnimation]);

  return (
    <div
      className={cn(
        "w-full h-full p-5 select-none transition-opacity duration-150 ease-in-out overflow-hidden relative",
        !isHovering ? "opacity-90" : ""
      )}
    >
      <motion.div
        className={cn(
          "w-full h-[400px] rounded-2xl bg-fd-card border border-fd-border py-5 px-2 absolute inset-0 drop-shadow-lg"
        )}
        animate={isHovering ? { y: -220, scale: 0.9 } : { y: -120, scale: 0.4 }}
      >
        <Form isHovering={isHovering} />
      </motion.div>
    </div>
  );
};

function Form({ isHovering }: { isHovering: boolean }) {
  return (
    <div className="w-full h-full flex flex-col gap-5 px-5">
      <div className="mt-[30px]"></div>
      <span className="text-center w-full flex justify-center items-center text-lg">
        Sign Up
      </span>
      <div className="w-full h-8 rounded-sm border-2 border-fd-border text-fd-muted-foreground px-2 flex justify-start items-center">
        Email
      </div>
      <div className="w-full h-8 rounded-sm border-2 border-fd-border text-fd-muted-foreground px-2 flex justify-start items-center">
        Password
      </div>
      <div className="mt-[10px]"></div>
      <span className="flex flex-col gap-5">
        <Checkbox id="tos">
          <CheckboxIndicator isHovering={isHovering} />
          <CheckboxLabel>Agree to TOS</CheckboxLabel>
        </Checkbox>
        <Checkbox id="tos">
          <CheckboxIndicator isHovering={isHovering} />
          <CheckboxLabel>Agree to Privacy Policy</CheckboxLabel>
        </Checkbox>
      </span>
      <div className="w-full text-center border border-fd-border py-1.5 rounded-md text-muted-foreground mt-2">
        Sign up!
      </div>
    </div>
  );
}

interface CheckboxContextProps {
  id: string;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}

const CheckboxContext = createContext<CheckboxContextProps>({
  id: "",
  isChecked: false,
  setIsChecked: () => {},
});

const tickVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

interface CheckboxProps {
  children: ReactNode;
  id: string;
}

export default function Checkbox({ children, id }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-center">
      <CheckboxContext.Provider
        value={{
          id,
          isChecked,
          setIsChecked,
        }}
      >
        {children}
      </CheckboxContext.Provider>
    </div>
  );
}

function CheckboxIndicator({ isHovering }: { isHovering: boolean }) {
  const { id, isChecked, setIsChecked } = useContext(CheckboxContext);

  useEffect(() => {
    setIsChecked(isHovering);
  });

  return (
    <button type="button" className="relative flex items-center">
      <input
        type="checkbox"
        className="border-blue-gray-200 relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all duration-500 checked:border-blue-500 checked:bg-blue-500"
        onChange={() => setIsChecked(!isChecked)}
        id={id}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-fd-muted-foreground">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3.5"
          stroke="currentColor"
          className="h-3.5 w-3.5"
          initial={false}
          animate={isChecked ? "checked" : "unchecked"}
          transition={{
            duration: 0.5,
            delay: 1,
          }}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
            variants={tickVariants}
          />
        </motion.svg>
      </div>
    </button>
  );
}

interface CheckboxLabelProps {
  children: ReactNode;
}

function CheckboxLabel({ children }: CheckboxLabelProps) {
  const { id, isChecked } = useContext(CheckboxContext);

  return (
    <motion.label
      className="relative ml-2 overflow-hidden text-sm"
      htmlFor={id}
      animate={{
        x: isChecked ? [0, -4, 0] : [0, 4, 0],
        color: isChecked
          ? "var(--color-fd-muted-foreground)"
          : "var(--color-fd-muted-foreground)",
        textDecorationLine: isChecked ? "line-through" : "none",
      }}
      initial={false}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.4,
      }}
    >
      {children}
    </motion.label>
  );
}
