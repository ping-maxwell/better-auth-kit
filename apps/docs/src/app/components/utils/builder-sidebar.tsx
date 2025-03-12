"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectItem } from "@radix-ui/react-select";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";
import { useBuilder } from "./builder-provider";

interface Option_base {
  type: "selection" | "checkbox";
  id: string;
  isDisabled?: boolean;
}

interface Option_Selection extends Option_base {
  type: "selection";
  options: string[];
  label: string;
}

interface Option_Checkbox extends Option_base {
  type: "checkbox";
  label: string;
  defaultValue: boolean;
}

type Option = Option_Selection | Option_Checkbox;

export function BuilderSidebar() {
  const { builder, setBuilder } = useBuilder();
  const [currentOpen, setCurrentOpen] = useState<number>(0);
  const [cts] = useState<
    { title: string; options: Option[]; canRemove?: boolean; id: string }[]
  >([
    {
      title: "Form",
      canRemove: false,
      id: "form",
      options: [
        {
          type: "checkbox",
          isDisabled: true,
          label: "Name field",
          defaultValue: true,
          id: "name",
        },
        {
          type: "checkbox",
          isDisabled: true,
          label: "Email field",
          defaultValue: true,
          id: "email",
        },
        {
          type: "checkbox",
          isDisabled: true,
          label: "Password field",
          defaultValue: true,
          id: "password",
        },
        {
          type: "checkbox",
          isDisabled: true,
          label: "Submit button",
          defaultValue: true,
          id: "submit",
        },
      ],
    },
    {
      title: "OAuth",
      canRemove: true,
      id: "oauth",
      options: [
        {
          label: "placement",
          type: "selection",
          options: ["above", "below"],
          id: "placement",
        },
        {
          label: "Icon only",
          type: "checkbox",
          defaultValue: true,
          id: "isIconOnly",
          isDisabled: false,
        },
        {
          label: "Facebook OAuth",
          type: "checkbox",
          defaultValue: true,
          id: "facebook",
          isDisabled: false,
        },
        {
          label: "Apple OAuth",
          type: "checkbox",
          defaultValue: true,
          id: "apple",
          isDisabled: false,
        },
        {
          label: "Google OAuth",
          type: "checkbox",
          defaultValue: true,
          id: "google",
          isDisabled: false,
        },
        {
          label: "Discord OAuth",
          type: "checkbox",
          defaultValue: true,
          id: "discord",
          isDisabled: false,
        },
        {
          label: "Github OAuth",
          type: "checkbox",
          defaultValue: true,
          id: "github",
          isDisabled: false,
        },
        {
          label: "Microsoft OAuth",
          type: "checkbox",
          defaultValue: true,
          id: "microsoft",
          isDisabled: false,
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
            <div
              key={item.title + index}
              className="relative w-screen sm:w-full"
            >
              <Button
                className={cn(
                  "cursor-pointer absolute top-2 right-3 w-fit h-6 px-2 py-2 has-[>svg]:px-1.5",
                  !item.canRemove && "hidden"
                )}
                variant={"ghost"}
                disabled={!item.canRemove}
              >
                <X className="size-3" />
              </Button>
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
                    <motion.div className="text-sm">
                      {item.options.map((opt, index) => {
                        if (opt.type === "checkbox") {
                          return (
                            <div
                              key={opt.label + index}
                              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-x-2.5 hover:bg-primary/5 px-5 h-[46px] py-2 break-words sm:w-[var(--fd-sidebar-width)] w-screen justify-between text-sm"
                            >
                              <p className="select-none">{opt.label}</p>
                              <div className="flex">
                                <Label
                                  htmlFor={opt.label + index}
                                  className="select-none cursor-pointer text-xs pr-2"
                                >
                                  {builder[item.id][opt.id]
                                    ? "Enabled"
                                    : "Disabled"}
                                </Label>
                                <Checkbox
                                  defaultChecked={opt.defaultValue}
                                  className="rounded-sm size-4 cursor-pointer"
                                  disabled={opt.isDisabled}
                                  checked={builder[item.id][opt.id]}
                                  id={opt.label + index}
                                  onCheckedChange={(checked) => {
                                    setBuilder({
                                      ...builder,
                                      [item.id]: {
                                        ...builder[item.id],
                                        [opt.id]: checked,
                                      },
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={opt.label + index}
                            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-x-2.5 hover:bg-primary/5 pl-5 pr-2 h-[46px] py-2 break-words sm:w-[var(--fd-sidebar-width)] w-screen justify-between text-sm"
                          >
                            <p className="select-none">{opt.label}</p>
                            <div className="">
                              <Select
                                onValueChange={(val) => {
                                  setBuilder({
                                    ...builder,
                                    [item.id]: {
                                      ...builder[item.id],
                                      [opt.id]: val,
                                    },
                                  });
                                }}
                              >
                                <SelectTrigger className="w-[150px] h-[30px] cursor-pointer text-xs">
                                  {builder[item.id][opt.id]}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {opt.options.map((x) => {
                                      return (
                                        <SelectItem
                                          key={x}
                                          value={x}
                                          className="px-2 text-sm py-1 hover:bg-primary/5 rounded-sm text-muted-foreground cursor-pointer"
                                        >
                                          {x}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        );
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
