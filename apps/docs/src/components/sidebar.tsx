"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import { AsideLink } from "@/components/ui/aside-link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { contents } from "./sidebar-content";
import { ChevronDownIcon, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "./mobile-sidebar-controller";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [currentOpen, setCurrentOpen] = useState<number>(0);
  const { isOpen, setIsOpen } = useMobileSidebar();
  const cts = contents;
  const pathname = usePathname();

  const getDefaultValue = useCallback(() => {
    const defaultValue = contents.findIndex((item) =>
      item.list.some((listItem) => listItem.href === pathname),
    );
    return defaultValue === -1 ? 0 : defaultValue;
  }, [pathname]);

  useEffect(() => {
    setCurrentOpen(getDefaultValue());
  }, [getDefaultValue]);

  return (
    <div className="fixed top-0 z-10">
      <aside
        className={cn(
          "border-r border-lines sm:w-[var(--fd-sidebar-width)] bg-background w-screen overflow-y-auto absolute top-[65px] h-dvh flex-col justify-between",
          isOpen ? "flex" : "hidden sm:flex",
        )}
      >
        <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0 }}>
          <div className="flex flex-col">
            {cts.map((item, index) => (
              <div key={item.title}>
                <button
                  className="border-b w-full hover:underline border-lines text-sm px-5 py-2.5 text-left flex items-center gap-2"
                  type="button"
                  onClick={() => {
                    if (currentOpen === index) {
                      setCurrentOpen(-1);
                    } else {
                      setCurrentOpen(index);
                    }
                  }}
                >
                  <item.Icon className="w-5 h-5" />
                  <span className="grow">{item.title}</span>
                  <motion.div
                    animate={{ rotate: currentOpen === index ? 180 : 0 }}
                  >
                    <ChevronDownIcon
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      )}
                    />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {currentOpen === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative overflow-hidden"
                    >
                      <motion.div
                        // initial={{ opacity: 0, y: -20 }}
                        // animate={{ opacity: 1, y: 0 }}
                        className="text-sm"
                      >
                        {item.list.map((listItem, j) => (
                          <div key={listItem.title}>
                            <Suspense fallback={<>Loading...</>}>
                              {listItem.group ? (
                                <div className="flex flex-row items-center gap-2 mx-5 my-1 ">
                                  <p className="text-sm text-transparent bg-gradient-to-tr dark:from-gray-100 dark:to-stone-200 bg-clip-text from-gray-900 to-stone-900">
                                    {listItem.title}
                                  </p>
                                  <div className="flex-grow h-px bg-gradient-to-r from-stone-800/90 to-stone-800/60" />
                                </div>
                              ) : (
                                <AsideLink
                                  href={listItem.href}
                                  startWith="/docs"
                                  title={listItem.title}
                                  className="break-words sm:w-[var(--fd-sidebar-width)] w-screen"
                                  onClick={() => {
                                    setIsOpen(false);
                                  }}
                                >
                                  <listItem.icon className="w-4 h-4 text-stone-950 dark:text-white" />
                                  {listItem.title}
                                </AsideLink>
                              )}
                            </Suspense>
                          </div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </MotionConfig>
      </aside>
    </div>
  );
}
