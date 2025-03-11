"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronDownIcon, User, X } from "lucide-react";
import { type ReactNode, type SVGProps, useState } from "react";

interface Option_base {
  type: "selection" | "checkbox";
  isDisabled: boolean;
}

interface Option_Selection extends Option_base {
  type: "selection";
  options: string[];
  defaultValue: string;
}

interface Option_Checkbox extends Option_base {
  type: "checkbox";
  label: string;
  defaultValue: boolean;
}

type Option = Option_Selection | Option_Checkbox;

export function BuilderSidebar() {
  const [currentOpen, setCurrentOpen] = useState<number>(0);
  const [cts] = useState<
    { title: string; options: Option[]; canRemove: boolean }[]
  >([
    {
      title: "Form",
      canRemove: false,
      options: [
        {
          type: "checkbox",
          isDisabled: true,
          label: "Name field",
          defaultValue: true,
        },
        {
          type: "checkbox",
          isDisabled: true,
          label: "Email field",
          defaultValue: true,
        },
        {
          type: "checkbox",
          isDisabled: true,
          label: "Password field",
          defaultValue: true,
        },
        {
          type: "checkbox",
          isDisabled: true,
          label: "Submit button",
          defaultValue: true,
        },
      ],
    },
  ]);

  return (
    <div className="border-l border-lines sm:w-[var(--fd-sidebar-width)] bg-background w-screen overflow-y-auto absolute h-[calc(100dvh_-_65px)] top-0 right-0 flex-col justify-between">
      <MotionConfig
        transition={{
          duration: 0.4,
          type: "spring",
          bounce: 0,
        }}
      >
        <div className="flex flex-col">
          {cts.map((item, index) => (
            <div key={item.title}>
              <button
                className="border-b w-full  border-lines text-sm px-5 py-2.5 text-left flex items-center gap-2"
                type="button"
                onClick={() => {
                  if (currentOpen === index) {
                    setCurrentOpen(-1);
                  } else {
                    setCurrentOpen(index);
                  }
                }}
              >
                <motion.div
                  animate={{
                    rotate: currentOpen === index ? 180 : 0,
                  }}
                >
                  <ChevronDownIcon
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                    )}
                  />
                </motion.div>
                <span className="grow">{item.title}</span>
                <Button
                  size={"xs"}
                  className="cursor-pointer"
                  variant={"ghost"}
                  disabled={!item.canRemove}
                >
                  <X className="size-3" />
                </Button>
              </button>
              <AnimatePresence initial={false}>
                {currentOpen === index && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative overflow-hidden"
                  >
                    <motion.div
                      className="text-sm"
                    >
                      {item.options.map((opt) => {
                        if (opt.type === "checkbox") {
                          const id = crypto.randomUUID();
                          return (
                            <div className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-x-2.5 hover:bg-primary/10 px-5 py-2 break-words sm:w-[var(--fd-sidebar-width)] w-screen">
                              <Checkbox
                                defaultChecked={opt.defaultValue}
                                className="rounded-sm size-4 cursor-pointer"
                                disabled={opt.isDisabled}
                                id={id}
                              />
                              <Label
                                htmlFor={id}
                                className="select-none cursor-pointer"
                              >
                                {opt.label}
                              </Label>
                            </div>
                          );
                        }
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </MotionConfig>
    </div>
  );
}
