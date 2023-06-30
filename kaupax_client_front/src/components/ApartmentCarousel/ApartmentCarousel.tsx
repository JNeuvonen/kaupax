import { useLayout } from "@/context/layout";
import styleUtils from "@/styles/utils.module.css";
import { EXTERNAL_LINK_BLUE, PRIMARY_BLUE_300 } from "@/utils/constants";
import { formatPrice } from "@/utils/functions";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { ListingMapBoxFmt } from "@/utils/types/listing";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState, useCallback } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { IntendedContent } from "../ContentSection";
import TooltipWrapper from "../MuiWrappers/tooltip";
import styles from "./ApartmentCarousel.module.css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
type Props = {
  apartments: ListingMapBoxFmt[];
  setApartments: React.Dispatch<React.SetStateAction<ListingMapBoxFmt[]>>;
};

export default function ApartmentCarousel({ apartments }: Props) {
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const { width } = useWindowDimensions();
  const [suggestionsPerPage, setSuggestionsPerPage] = useState(7);
  const [, setSwiperInstance] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const layout = useLayout();
  const [FILTER_OPTIONS] = useState(["Hinta", "Tarjoukset", "Neliöt"]);
  const [sortBy, setSortBy] = useState(FILTER_OPTIONS[0]);
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const [, updateState] = useState({} as any);
  const forceUpdate = useCallback(() => updateState({}), []);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    layout.setLayoutMaxWidth("1200px");
  });

  const handleClose = () => {
    setAnchorEl(null);
    setFiltersOpen(false);
  };

  function getValueBySort(apartment: ListingMapBoxFmt) {
    if (sortBy === "Hinta") {
      return apartment.properties.usersEstimateOfPrice;
    }

    if (sortBy === "Tarjoukset") {
      return apartment.properties.Bid.length;
    }

    if (sortBy === "Neliöt") {
      return apartment.properties.surfaceArea;
    }

    return 0;
  }

  function getComparator(a: ListingMapBoxFmt, b: ListingMapBoxFmt) {
    return (getValueBySort(a) - getValueBySort(b)) * (sort === "asc" ? 1 : -1);
  }

  function sortApartments() {
    return apartments.sort((a, b) => getComparator(a, b));
  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
    const widthHelper = width > 1200 ? 1200 : width;
    const maxSlides = Math.floor(widthHelper / 450);
    setSuggestionsPerPage(maxSlides + 1.2);
  }, [width, mounted]);

  if (apartments.length === 0 || !suggestionsVisible) {
    return (
      <div
        className={styles.container}
        style={{
          height: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IntendedContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 className={styleUtils.paragraph}>
              {apartments.length} Asuntoa kartalla
            </h3>

            {apartments.length > 0 && (
              <span
                style={{ color: EXTERNAL_LINK_BLUE, cursor: "pointer" }}
                onClick={() => setSuggestionsVisible(true)}
              >
                Suurenna
              </span>
            )}
          </div>
        </IntendedContent>
      </div>
    );
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setFiltersOpen(true);
  };

  const menuItemOnClick = (item: string) => {
    setSortBy(item);

    if (sortBy === item) {
      setSort(sort === "asc" ? "desc" : "asc");
    }
    setFiltersOpen(false);
    setAnchorEl(null);
    forceUpdate();
  };

  return (
    <div className={styles.container}>
      <IntendedContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", columnGap: "24px", alignItems: "center" }}
          >
            <h3 className={styleUtils.paragraph}>
              {apartments.length} Asuntoa
            </h3>

            <TooltipWrapper hint={"Järjestele asuntoja"}>
              <IconButton
                onClick={handleClick}
                id="demo-positioned-button"
                aria-haspopup="true"
                style={{
                  position: "relative",
                }}
              >
                <FilterListIcon fontSize={"small"} />
              </IconButton>
            </TooltipWrapper>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={filtersOpen}
              onClose={handleClose}
            >
              {FILTER_OPTIONS.map((item) => {
                return (
                  <MenuItem
                    key={item}
                    onClick={() => menuItemOnClick(item)}
                    selected={sortBy === item}
                  >
                    {item}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>

          <TooltipWrapper hint={"Pienennä valikko"}>
            <span
              style={{ color: EXTERNAL_LINK_BLUE, cursor: "pointer" }}
              onClick={() => setSuggestionsVisible(false)}
            >
              Pienennä
            </span>
          </TooltipWrapper>
        </div>
        <Divider style={{ marginTop: "2px", marginBottom: "8px" }} />

        <Swiper
          style={{
            overflow: "hidden !important",
          }}
          pagination={{ clickable: true }}
          slidesPerView={suggestionsPerPage}
          spaceBetween={15}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {sortApartments().map((apartment) => {
            return (
              <SwiperSlide key={apartment.properties.uuid}>
                <div className={styles.carouselCard}>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: "18px" }}>
                      {apartment.properties.addressFull.replace(
                        ", Finland",
                        ""
                      )}
                    </h3>

                    <p
                      className={styleUtils.paragraph}
                      style={{ fontSize: "20px", color: "#666363" }}
                    >
                      {apartment.properties.surfaceArea} m²
                    </p>

                    <p
                      className={styleUtils.paragraph}
                      style={{ fontSize: "20px", color: "#666363" }}
                    >
                      {formatPrice(
                        String(apartment.properties.usersEstimateOfPrice)
                      )}
                      €
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "2px",
                        columnGap: "5px",
                      }}
                    >
                      <p style={{ fontWeight: "600", color: PRIMARY_BLUE_300 }}>
                        {apartment.properties.Bid.length}{" "}
                        {apartment.properties.Bid.length === 1
                          ? "kiinteistönvälittäjän tarjous"
                          : "kiinteistönvälittäjän tarjousta"}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </IntendedContent>
    </div>
  );
}
