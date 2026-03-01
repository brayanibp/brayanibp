"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MDXContentContextType {
  registerComponent: (name: string, content: any) => void;
  getComponentContent: (name: string) => any;
}

const MDXContentContext = createContext<MDXContentContextType>({
  registerComponent: () => {},
  getComponentContent: () => null,
});

export const useMDXContent = () => useContext(MDXContentContext);

interface MDXContentProviderProps {
  children: ReactNode;
}

export function MDXContentProvider({ children }: MDXContentProviderProps) {
  const [componentContents, setComponentContents] = useState<Record<string, any>>({});

  const registerComponent = (name: string, content: any) => {
    setComponentContents(prev => ({ ...prev, [name]: content }));
  };

  const getComponentContent = (name: string) => {
    return componentContents[name];
  };

  return (
    <MDXContentContext.Provider value={{ registerComponent, getComponentContent }}>
      {children}
    </MDXContentContext.Provider>
  );
}
