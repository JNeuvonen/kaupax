import { Apartment } from "@/utils/types/apartment";
import { Realtor } from "@/utils/types/realtor";
import { Box } from "@mui/material";
import DetailsTab from "./detailsTab";
import Messages from "./messages";
import OffersTab from "./Offers";
import Pictures from "./pictures";

export type PageTabItem = {
  component: () => JSX.Element;
  index: number;
  href: string;
  label: string;
};

export const TabItems = ({
  apartment,
  accessToken,
  user,
  setNewTabItems,
}: {
  apartment: Apartment;
  accessToken: string;
  user: Realtor;
  setNewTabItems: (newData: Apartment) => void;
}) => [
  {
    component: () => {
      return (
        <Box>
          <DetailsTab apartment={apartment} />
        </Box>
      );
    },
    index: 0,
    href: `/ilmoitus/${apartment.uuid + "/tiedot"}`,
    label: "Tiedot",
  },
  {
    component: () => {
      return <Pictures apartment={apartment} />;
    },
    index: 1,
    href: `/ilmoitus/${apartment.uuid + "/kuvat"}`,
    label: "Kuvat",
  },
  {
    component: () => {
      return (
        <Box>
          <OffersTab
            apartment={apartment}
            accessToken={accessToken}
            realtor={user}
          />
        </Box>
      );
    },
    index: 2,
    href: `/ilmoitus/${apartment.uuid + "/tarjoukset"}`,
    label: "Tarjoukset",
  },

  {
    component: () => {
      return <Messages apartment={apartment} setNewTabItems={setNewTabItems} />;
    },
    index: 2,
    href: `/ilmoitus/${apartment.uuid + "/viestit"}`,
    label: "Viestit",
  },
];
