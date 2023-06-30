import TypographySecondary from "@/components/MuiWrappers/Typography/text-secondary";
import WhiteCard from "@/components/StyleWrappers/card";
import styles from "@/styles/startOfSale.module.css";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { CardDefaultProps } from "./apartmentType";

interface CardProps extends CardDefaultProps {
  setStartOfSale: React.Dispatch<React.SetStateAction<string>>;
  startOfSale: string;
}

export default function StartOfSale({
  setStartOfSale,
  startOfSale,
  incrementStep,
}: CardProps) {
  const [labels] = useState([
    "Samantien",
    "2 kuukauden sisällä",
    "Olen ostamassa toista asuntoa.",
    "Haluan vain nähdä tarjouksia",
    "Asuntoni on jo myynnissä",
  ]);

  const onClickCallback = (item: string) => {
    setStartOfSale(item);
    incrementStep({ lastStepItems: null });
  };

  return (
    <Box sx={{ margin: "0 auto" }}>
      <Typography
        variant={"h5"}
        sx={{ opacity: "0.7" }}
        className={styles.mainTitle}
      >
        Milloin myynti aloitetaan?
      </Typography>
      <Box
        sx={{
          display: "flex",
          rowGap: "20px",
          columnGap: "20px",
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        {labels.map((item) => {
          return (
            <WhiteCard
              key={item}
              height={"auto"}
              active={startOfSale === item}
              onClickCallback={() => {
                onClickCallback(item);
              }}
              className={styles.whiteCard}
            >
              <TypographySecondary
                props={{ fontWeight: "700" }}
                className={styles.typography}
              >
                {item}
              </TypographySecondary>
            </WhiteCard>
          );
        })}
      </Box>
    </Box>
  );
}
