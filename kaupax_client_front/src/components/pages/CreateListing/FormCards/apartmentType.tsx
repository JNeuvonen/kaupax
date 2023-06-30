import TypographySecondary from "@/components/MuiWrappers/Typography/text-secondary";
import WhiteCard from "@/components/StyleWrappers/card";
import {
  GarageIcon,
  MaterialFilledCondoIcon,
  RivitaloIcon,
  SemiDetachedHouse,
  SingleFamilyHomeIcon,
} from "@/utils/icons";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import styles from "@/styles/apartmentType.module.css";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";

export interface LastStepItems {
  givenName: string;
  surname: string;
  email: string;
  phone: string;
}
export interface CardDefaultProps {
  incrementStep: ({
    lastStepItems,
  }: {
    lastStepItems: LastStepItems | null;
  }) => void;
  decrementStep?: () => void;
}

interface CardProps extends CardDefaultProps {
  selectedApartmentType: string;
  setApartmentType: React.Dispatch<React.SetStateAction<string>>;
}

export default function ApartmentType({
  selectedApartmentType,
  setApartmentType,
  incrementStep,
}: CardProps) {
  const { width } = useWindowDimensions();
  const [apartmentTypes] = useState([
    {
      name: "Kerrostalo",
      icon: (width: number) => <MaterialFilledCondoIcon width={width} />,
    },
    {
      name: "Omakotitalo",
      icon: (width: number) => <SingleFamilyHomeIcon width={width} />,
    },
    {
      name: "Paritalo",
      icon: (width: number) => <SemiDetachedHouse width={width} />,
    },
    {
      name: "Rivitalo",
      icon: (width: number) => <RivitaloIcon width={width} />,
    },
    {
      name: "Luhtitalo",
      icon: (width: number) => <RivitaloIcon width={width} />,
    },
    {
      name: "Vapaa-ajan asunto",
      icon: (width: number) => <RivitaloIcon width={width} />,
    },
    {
      name: "Erillistalo",
      icon: (width: number) => <RivitaloIcon width={width} />,
    },
    {
      name: "Tontti",
      icon: (width: number) => <RivitaloIcon width={width} />,
    },
    {
      name: "Autotalli",
      icon: (width: number) => <GarageIcon width={width} />,
    },
    {
      name: "Muu",
      icon: (width: number) => <RivitaloIcon width={width} />,
    },
  ]);

  const getIconWidth = () => {
    if (width > 1000) {
      return 60;
    }
    if (width > 700) {
      return 70;
    }

    return 50;
  };

  const clickOnApartmentType = (apartmentType: string) => {
    setApartmentType(apartmentType);
    incrementStep({ lastStepItems: null });
  };

  return (
    <>
      <Typography
        variant={"h5"}
        sx={{ opacity: "0.7" }}
        className={styles.mainTitle}
      >
        Onko asunto?
      </Typography>

      <Box className={styles.contentWrapper}>
        {apartmentTypes.map((apartmentType) => {
          return (
            <WhiteCard
              active={apartmentType.name === selectedApartmentType}
              key={apartmentType.name}
              onClickCallback={() => clickOnApartmentType(apartmentType.name)}
              className={styles.apartmentCard}
              height={"130"}
            >
              {apartmentType.icon(getIconWidth())}
              <TypographySecondary
                props={{ fontSize: "25px", fontWeight: "600" }}
                className={styles.apartmentInfoTypography}
              >
                {apartmentType.name}
              </TypographySecondary>
            </WhiteCard>
          );
        })}
      </Box>
    </>
  );
}
