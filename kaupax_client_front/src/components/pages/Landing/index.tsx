import ContentSection from "@/components/ContentSection";
import { useLayout } from "@/context/layout";
import { GooglePlace } from "@/utils/types/google";
import Box from "@mui/material/Box";
import React from "react";
import CtaDiv from "./ctaDiv";
import FirstSection from "./firstSection";
import QaSection from "./qaSection";
import SecondSection from "./secondSection";
import ThirdSection from "./thirdSection";

export default function Landing() {
  const layout = useLayout();

  React.useEffect(() => {
    layout.setLayoutMaxWidth("1200px");
  }, [layout]);

  return (
    <Box>
      <ContentSection>
        <FirstSection layout={layout} />
      </ContentSection>
      <CtaDiv />
      <SecondSection />
      <ThirdSection />
      <QaSection />
    </Box>
  );
}

export type InputValue = GooglePlace | null | { description: string };
