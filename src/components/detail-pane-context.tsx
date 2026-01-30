"use client";

import { createContext, useContext, useState, useCallback } from "react";

type DetailPaneContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setContent: (content: React.ReactNode) => void;
  content: React.ReactNode;
};

const DetailPaneContext = createContext<DetailPaneContextValue | null>(null);

export function DetailPaneProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContentState] = useState<React.ReactNode>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const setContent = useCallback((newContent: React.ReactNode) => {
    setContentState(newContent);
  }, []);

  return (
    <DetailPaneContext.Provider value={{ isOpen, open, close, toggle, setContent, content }}>
      {children}
    </DetailPaneContext.Provider>
  );
}

export function useDetailPane() {
  const context = useContext(DetailPaneContext);
  if (!context) {
    throw new Error("useDetailPane must be used within a DetailPaneProvider");
  }
  return context;
}
