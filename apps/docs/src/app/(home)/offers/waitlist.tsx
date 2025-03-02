"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const emailVariants = {
  show: {
    opacity: 1,
    filter: "blur(0px)",
  },
  hide: {
    opacity: 0,
    filter: "blur(10px)",
  },
};

const totalLetters = "example@gmail.com".length;
const lettersAnimationDuration = 0.15 * 1000 * totalLetters + 1500;

export const WaitlistOffer = ({ isHovering }: { isHovering: boolean }) => {
  const [emailPlaceholderDisplay, setEmailPlaceholderDisplay] = useState(true);
  const [showLetters, setShowLetters] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(false);
  const [inputBoxLoading, setInputBoxLoading] = useState(false);
  const emailPlaceholderDisplayTimeout = useRef<Timer | null>(null);
  const lettersInterval = useRef<Timer | null>(null);
  const loadingSpinner = useRef<Timer | null>(null);
  const autoRestartLoopTimer = useRef<Timer | null>(null);

  const clear = useCallback(() => {
    if (emailPlaceholderDisplayTimeout.current) {
      clearTimeout(emailPlaceholderDisplayTimeout.current);
    }
    if (lettersInterval.current) {
      clearInterval(lettersInterval.current);
    }
    if (loadingSpinner.current) {
      clearTimeout(loadingSpinner.current);
    }
    if (autoRestartLoopTimer.current) {
      clearTimeout(autoRestartLoopTimer.current);
    }
    setEmailPlaceholderDisplay(true);
    setShowLetters(false);
    setUpdateTitle(false);
  }, []);

  const restartAnimation = useCallback(() => {
    clear();
    setEmailPlaceholderDisplay(false);
    emailPlaceholderDisplayTimeout.current = setTimeout(() => {
      setUpdateTitle(true);
      setShowLetters(false);

      setTimeout(() => {
        setUpdateTitle(false);
        setEmailPlaceholderDisplay(true);
        setTimeout(() => {
          setInputBoxLoading(false);
          autoRestartLoopTimer.current = setTimeout(() => {
            restartAnimation();
          }, 1000);
        }, 300);
      }, 1500);
    }, lettersAnimationDuration);
    loadingSpinner.current = setTimeout(() => {
      setInputBoxLoading(true);
    }, lettersAnimationDuration + 200);
    setShowLetters(true);
  }, [clear]);

  useEffect(() => {
    if (isHovering) {
      restartAnimation();
    } else {
      clear();
    }

    return () => {
      clear();
    };
  }, [isHovering, clear, restartAnimation]);

  return (
    <motion.div
      className={cn(
        "w-full h-full p-5 select-none transition-opacity duration-150 ease-in-out",
        !isHovering ? "opacity-90" : "",
      )}
      animate={
        isHovering
          ? {
              scale: 1.1,
            }
          : { scale: 1 }
      }
    >
      <div
        className={cn(
          "w-full h-full  rounded-2xl bg-gradient-to-br from-fd-border/50 to-fd-border/20 py-5 px-2",
          isHovering && "shadow-xl ",
        )}
      >
        <div className="mt-5"></div>
        <AnimatedTitle shouldUpdate={updateTitle} />
        <div className="w-full flex justify-center items-center mt-3 px-8">
          {inputBoxLoading && (
            <LoaderCircle className="animate-spin text-fd-muted-foreground/50 size-4" />
          )}
          <div
            className={cn(
              "w-full h-6 rounded-sm border-1 border-fd-border items-center px-2 overflow-hidden relative",
              inputBoxLoading ? "hidden" : "flex",
            )}
          >
            <motion.span
              className="text-fd-muted-foreground/50"
              style={{
                fontSize: "10px",
              }}
              initial={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              variants={emailVariants}
              animate={emailPlaceholderDisplay ? "show" : "hide"}
              transition={{
                duration: 0.5,
                bounce: 0,
              }}
            >
              Enter your email
            </motion.span>
            <div className="absolute inset-0 flex items-center px-2">
              {"example@gmail.com".split("").map((l, i) => (
                <AnimatedLetter
                  letter={l}
                  index={i + 1}
                  show={showLetters}
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function AnimatedTitle({ shouldUpdate: started }: { shouldUpdate: boolean }) {
  const [title, setTitle] = useState("Join the waitlist!");
  const [currentAni, setCurrentAni] = useState("show");

  useEffect(() => {
    if (started) {
      setCurrentAni("hide");
      setTimeout(() => {
        setTitle("Success! 🎉");
        setCurrentAni("show");
        setTimeout(() => {
          setCurrentAni("hide");
          setTimeout(() => {
            setTitle("Join the waitlist!");
            setCurrentAni("show");
          }, 250);
        }, 1500);
      }, 250);
    }
  }, [started]);

  const variants = {
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
    hide: {
      opacity: 0,
      filter: "blur(10px)",
    },
  };

  return (
    <motion.span
      className="w-full text-center text-muted-foreground flex justify-center items-center"
      style={{
        fontSize: "17px",
      }}
      variants={variants}
      animate={currentAni}
      transition={{}}
    >
      {title}
    </motion.span>
  );
}

function AnimatedLetter({
  letter,
  index,
  show,
}: {
  letter: string;
  index: number;
  show: boolean;
}) {
  const variants = {
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    hide: {
      y: -30,
      opacity: 0,
      filter: "blur(10px)",
    },
  };

  return (
    <motion.span
      className="text-muted-foreground/50"
      style={{
        fontSize: "10px",
      }}
      initial={{
        y: 0,
        opacity: 0,
      }}
      variants={variants}
      animate={show ? "show" : "hide"}
      transition={{
        duration: 0.2,
        bounce: 0,
        delay: show ? index * 0.15 : 0,
      }}
    >
      {letter}
    </motion.span>
  );
}
