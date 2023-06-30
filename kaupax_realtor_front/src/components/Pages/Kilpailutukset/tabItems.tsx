import MapWrapper from "@/components/Maps";
import { ApartmentMapBoxFmtFuncRet } from "@/utils/types/apartment";
import { Box } from "@mui/material";

export type PageTabItem = {
  component: () => JSX.Element;
  index: number;
  href: string;
  label: string;
};

export const TabItems = ({
  apartments,
}: {
  apartments: ApartmentMapBoxFmtFuncRet;
}) => [
  {
    component: () => {
      return (
        <Box sx={{ width: "calc(100% + 48px)", marginLeft: "-24px" }}>
          <MapWrapper apartments={apartments} />
        </Box>
      );
    },
    index: 0,
    href: "/kilpailutukset/kartta",
    label: "Kartta",
  },
  {
    component: () => {
      return (
        <Box>
          <h1>Tulossa pian...</h1>
        </Box>
      );
    },
    index: 0,
    href: "/kilpailutukset/osoitehaku",
    label: "Osoitehaku",
  },
];
