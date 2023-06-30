import { BODY_WIDTH_SMALL } from "@/utils/constants";
import React, { useContext } from "react";

type LayoutTypes = "default" | "extra-intended-default";

export type LayoutContext = {
  type: LayoutTypes;
  setType: React.Dispatch<React.SetStateAction<LayoutTypes>>;
  setLayoutMaxWidth: React.Dispatch<React.SetStateAction<string>>;

  layoutProps: {
    contentMaxWidth: string;
    contentMaxWidthFormatted: number | string;
  };
};

const LayoutContext = React.createContext<LayoutContext>({} as LayoutContext);

export const LayoutProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [type, setType] = React.useState<LayoutTypes>("default");
  const [maxWidth, setLayoutMaxWidth] = React.useState(BODY_WIDTH_SMALL);

  const contentMaxWidthFormatted = () => {
    if (typeof maxWidth === "string" && maxWidth.includes("px")) {
      return Number(maxWidth.replace("px", "").replace(" ", ""));
    }

    return maxWidth;
  };

  const getLayoutProps = () => {
    return {
      contentMaxWidth: maxWidth,
      contentMaxWidthFormatted: contentMaxWidthFormatted(),
    };
  };

  const provider = React.useMemo(() => {
    return {
      type,
      setType,
      setLayoutMaxWidth,
      layoutProps: getLayoutProps(),
    };
  }, [type, getLayoutProps]);

  return (
    <LayoutContext.Provider value={provider}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
