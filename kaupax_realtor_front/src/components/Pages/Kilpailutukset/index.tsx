import Spinner from "@/components/Spinner";
import TabsWrapper from "@/components/Tabs";
import { getApartmentWithMapboxLayerFmt } from "@/utils/functions";
import { useQueryKey } from "@/utils/tanstack";
import { ApartmentMapBoxFmtFuncRet } from "@/utils/types/apartment";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { TabItems } from "./tabItems";

export default function KilpailutuksetWrapper({
  accessToken,
}: {
  accessToken: string;
}) {
  const [tabItems, setTabItems] = useState<any>(null);
  const [tabValue, setTabValue] = useState<null | number>(null);
  const apartmentQuery = useQueryKey({
    url: `${process.env.NEXT_PUBLIC_API_URL}/listing/get/all`,
    accessToken: accessToken,
    key: "all-listings",
  });

  const [apartments, setApartments] = useState({} as ApartmentMapBoxFmtFuncRet);

  useEffect(() => {
    if (window.location.pathname === "/kilpailutukset/kartta") {
      setTabValue(0);
    } else if (window.location.pathname === "/kilpailutukset/osoitehaku") {
      setTabValue(1);
    }
  }, []);

  useEffect(() => {
    if (
      apartmentQuery.data?.res &&
      apartmentQuery.data?.res.payload.length !== 0
    ) {
      const data = getApartmentWithMapboxLayerFmt(
        apartmentQuery.data.res.payload
      );
      setApartments(data);
      setTabItems(TabItems({ apartments: data }));
    }
  }, [apartmentQuery.data?.res.payload, apartmentQuery.data]);

  if (apartments.features === undefined) {
    return <Spinner />;
  }

  return (
    <Box>
      {tabValue !== null && (
        <TabsWrapper defaultValue={tabValue} tabPanels={tabItems} />
      )}
    </Box>
  );
}
