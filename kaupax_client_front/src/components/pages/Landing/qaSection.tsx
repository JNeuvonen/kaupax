import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentSection from "@/components/ContentSection";
import { useState } from "react";
import { QA_ITEMS } from "./qaItems";

export default function QaSection() {
  const [qaItems] = useState(QA_ITEMS);
  return (
    <ContentSection>
      <div>
        {qaItems.map((item, i) => {
          return (
            <Accordion
              elevation={0}
              style={{ border: "2px solid #d7d7d7" }}
              key={i}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{item.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>{item.content}</AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </ContentSection>
  );
}
