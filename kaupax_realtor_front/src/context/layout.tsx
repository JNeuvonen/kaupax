import { SIDE_MENU_WIDTH } from "@/utils/constants";
import React, { useMemo, useState, useContext } from "react";

type LayoutContextType = {
  sideMenuWidth: string;
  setSideMenuWidth: React.Dispatch<React.SetStateAction<string>>;
  intendedContent: number;
  setIntendedContent: React.Dispatch<React.SetStateAction<number>>;
};

const LayoutContext = React.createContext<LayoutContextType>(
  {} as LayoutContextType
);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [sideMenuWidth, setSideMenuWidth] = useState<string>(SIDE_MENU_WIDTH);
  const [intendedContent, setIntendedContent] = useState<number>(0);

  const provider = useMemo(() => {
    return {
      sideMenuWidth,
      setSideMenuWidth,
      intendedContent,
      setIntendedContent,
    };
  }, [sideMenuWidth, intendedContent]);

  return (
    <LayoutContext.Provider value={provider}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
