"use client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

export interface ComprehensiveContextType {
  levelOfDetail: "basic" | "comprehensive";
  set: (levelOfDetail: "basic" | "comprehensive") => void;
  onChange: (
    cb: (levelOfDetail: "basic" | "comprehensive") => void
  ) => () => void;
}

export const ComprehensiveContext = createContext<ComprehensiveContextType>({
  levelOfDetail: "basic",
  set: () => {},
  onChange: () => () => {},
});

export const ComprehensiveProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const levelOfDetail =
    useRef<ComprehensiveContextType["levelOfDetail"]>("basic");

  const subscriptions = useRef<
    Array<(levelOfDetail: "basic" | "comprehensive") => void>
  >([]);

  const set = useCallback((levelOfDetailR: "basic" | "comprehensive") => {
    levelOfDetail.current = levelOfDetailR;
    subscriptions.current.forEach((cb) => cb(levelOfDetailR));
    localStorage.setItem("levelOfDetail", levelOfDetailR);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const levelOfDetailR = localStorage.getItem("levelOfDetail") as
      | "basic"
      | "comprehensive";
      console.log(`got:`, levelOfDetailR);
    if (levelOfDetailR) {
      set(levelOfDetailR);
    }
  }, [set]);

  const onChange = useCallback(
    (cb: (levelOfDetail: "basic" | "comprehensive") => void) => {
      subscriptions.current.push(cb);
      return () => {
        subscriptions.current = subscriptions.current.filter(
          (cb2) => cb2 !== cb
        );
      };
    },
    []
  );

  return (
    <ComprehensiveContext.Provider
      value={{ levelOfDetail: levelOfDetail.current, set, onChange }}
    >
      {children}
    </ComprehensiveContext.Provider>
  );
};

export const useComprehensive = () => {
  const context = useContext(ComprehensiveContext);
  if (!context) {
    throw new Error(
      "useComprehensive must be used within a ComprehensiveProvider"
    );
  }
  return context;
};
