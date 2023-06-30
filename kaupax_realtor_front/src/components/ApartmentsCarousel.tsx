import { useLayout } from "@/context/layout";
import {
  BLACK_100,
  BLACK_200,
  BLUE_100,
  SIDE_MENU_BP,
  SIDE_MENU_FOCUS_WIDTH,
  SIDE_MENU_WIDTH,
  WHITE_TEXT,
} from "@/utils/constants";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { ExternalLinkIcon, GreenCircle } from "@/utils/icons";
import { ApartmentMapBoxFmt } from "@/utils/types/apartment";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import TypographyMaxLen from "./MUI/Typography/tooltip";
export default function ApartmentsCarousel({
  apartments,
  setApartments,
}: {
  apartments: ApartmentMapBoxFmt[];
  setApartments: React.Dispatch<React.SetStateAction<ApartmentMapBoxFmt[]>>;
}) {
  const marginLeft = useLayout().sideMenuWidth;
  const [, setSwiperInstance] = useState<any>(null);
  const { width } = useWindowDimensions();
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [suggestionsPerPage, setSuggestionsPerPage] = useState(7);

  useEffect(() => {
    if (!mounted) {
      setSuggestionsVisible(width > SIDE_MENU_BP ? true : false);
      setMounted(true);
    }
    const maxSlides = Math.floor(width / 330);
    setSuggestionsPerPage(maxSlides + 1.2);
  }, [width, mounted]);

  if (!suggestionsVisible || apartments.length === 0) {
    return (
      <Box
        id={"apartment-suggestions"}
        sx={{
          height: "35px",
          display: "flex",
          alignItems: "center",
          background: BLACK_100,
          left: marginLeft,
          width: `calc(100% - ${marginLeft})`,
          zIndex: "3",
          position: "fixed",
          bottom: 0,
          transition: "0.22s cubic-bezier(0.42, 0, 0.58, 1)",
          paddingLeft:
            marginLeft === SIDE_MENU_WIDTH ||
            marginLeft === SIDE_MENU_FOCUS_WIDTH
              ? "46px"
              : "16px",
          paddingRight:
            marginLeft === SIDE_MENU_WIDTH ||
            marginLeft === SIDE_MENU_FOCUS_WIDTH
              ? "46px"
              : "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "6px" }}>
            {apartments.length > 0 && (
              <GreenCircle
                width={"25px"}
                fill={apartments.length > 0 ? "#68E158" : "red"}
              />
            )}
            <Typography
              variant={"body2"}
              color={WHITE_TEXT({ alpha: "0.7" })}
              fontSize={"18px"}
            >
              {apartments.length} Asuntoa
            </Typography>
          </Box>

          <Box>
            <Button
              sx={{ fontSize: "16px", color: "purple" }}
              onClick={() => setSuggestionsVisible(true)}
              disabled={apartments.length === 0}
            >
              Suurenna
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      id={"apartment-suggestions"}
      sx={{
        height: "180px",
        background: BLACK_100,
        zIndex: "3",
        position: "fixed",
        left: marginLeft,
        width: `calc(100% - ${marginLeft})`,
        bottom: 0,
        transition: "0.22s cubic-bezier(0.42, 0, 0.58, 1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderTopLeftRadius: width < SIDE_MENU_BP ? "30px" : "0px",
        borderTopRightRadius: width < SIDE_MENU_BP ? "30px" : "0",
        color: "white",
        padding: "16px",
        paddingLeft:
          marginLeft === SIDE_MENU_WIDTH || marginLeft === SIDE_MENU_FOCUS_WIDTH
            ? "46px"
            : "16px",
        paddingRight:
          marginLeft === SIDE_MENU_WIDTH || marginLeft === SIDE_MENU_FOCUS_WIDTH
            ? "46px"
            : "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography
            variant={"body2"}
            color={WHITE_TEXT({ alpha: "0.7" })}
            fontSize={"18px"}
          >
            {apartments.length} Asuntoa
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ fontSize: "16px", color: "purple" }}
            onClick={() => setSuggestionsVisible(false)}
          >
            Sulje {width < 500 ? "" : "Ehdotukset"}
          </Button>
        </Box>
      </Box>
      <Box>
        {" "}
        <Swiper
          style={{
            overflow: "hidden !important",
          }}
          pagination={{ clickable: true }}
          slidesPerView={suggestionsPerPage}
          spaceBetween={15}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {apartments.map((apartment, i) => {
            const street =
              apartment.properties.street +
              (width > SIDE_MENU_BP ? `, ${apartment.properties.city}` : null);
            return (
              <SwiperSlide
                key={i}
                style={{
                  padding: "12px",
                  backgroundColor: BLACK_200,
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <Box>
                  <Typography fontSize={"15px"}>
                    <TypographyMaxLen content={street} cutoffLength={25} />
                  </Typography>
                </Box>

                <Typography fontWeight={200} variant="body2" color={"#cccccc"}>
                  {apartment.properties.surfaceArea} neliötä
                </Typography>

                <Link
                  href={`/ilmoitus/${apartment.properties.uuid}/tiedot`}
                  onClick={() => setApartments([])}
                >
                  <Box
                    sx={{
                      display: "flex",
                      columnGap: "16px",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Typography
                      color={BLUE_100}
                      fontSize={"14px"}
                      variant={"body2"}
                    >
                      Ilmoitukseen
                    </Typography>
                    <ExternalLinkIcon fill={BLUE_100} width={19} />
                  </Box>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Box>
  );
}
