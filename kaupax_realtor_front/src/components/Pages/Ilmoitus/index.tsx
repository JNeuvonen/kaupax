import Spinner from "@/components/Spinner";
import TabsWrapper from "@/components/Tabs";
import { useLayout } from "@/context/layout";
import { getListingDetailed } from "@/services/endpoints";
import { getReq } from "@/services/util";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { Apartment } from "@/utils/types/apartment";
import { Realtor } from "@/utils/types/realtor";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageTabItem, TabItems } from "./tabItems";

export default function IlmoitusWrapper({
  accessToken,
  user,
}: {
  accessToken: string;
  user: Realtor;
}) {
  const [tabItems, setTabItems] = useState<null | PageTabItem[]>(null);

  const { width } = useWindowDimensions();

  const router = useRouter();
  const { uuid } = router.query;
  const [data, setData] = useState<Apartment | null>(null);
  const [tabValue, setTabValue] = useState<null | number>(null);
  const layout = useLayout();

  useEffect(() => {
    if (data) {
      if (window.location.pathname === `/ilmoitus/${data.uuid}/tiedot`) {
        setTabValue(0);
      } else if (
        window.location.pathname === `/ilmoitus/${data.uuid}/tarjoukset`
      ) {
        setTabValue(2);
      } else if (window.location.pathname === `/ilmoitus/${data.uuid}/kuvat`) {
        setTabValue(1);
      } else if (
        window.location.pathname === `/ilmoitus/${data.uuid}/viestit`
      ) {
        setTabValue(3);
      }
    }
  }, [data]);

  useEffect(() => {
    if (width < 1500 && layout.intendedContent !== 0) {
      layout.setIntendedContent(0);
    }

    if (width >= 1500 && layout.intendedContent === 0) {
      layout.setIntendedContent(width * 0.1);
    }

    return () => {
      layout.setIntendedContent(0);
    };
  }, [width]);

  const setNewTabItems = (newData: Apartment) => {
    setTabItems(
      TabItems({
        apartment: newData,
        accessToken,
        user,
        setNewTabItems,
      })
    );
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      if (!uuid || !accessToken) return;

      const url = getListingDetailed(uuid as string);
      const { res, status } = await getReq({
        token: accessToken as string,
        url,
      });

      if (status === 200) {
        setData(res.payload);
        setTabItems(
          TabItems({
            apartment: res.payload,
            accessToken,
            user,
            setNewTabItems,
          })
        );
      }
    };

    asyncWrapper();
  }, [uuid, accessToken, user]);

  if (!data && !tabItems) {
    return <Spinner />;
  }

  return (
    <Box>
      {tabValue !== null && (
        <TabsWrapper
          defaultValue={tabValue}
          tabPanels={tabItems as PageTabItem[]}
        />
      )}
    </Box>
  );
}
