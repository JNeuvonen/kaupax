import MapWrapper from "@/components/Map";
import { getAllListings } from "@/utils/endpoints";
import { useState, useEffect } from "react";
import { useQueryKey } from "@/utils/tanstack";
import { getApartmentWithMapboxLayerFmt } from "@/utils/functions";
import { ApartmentMapBoxFmtFuncRet } from "@/utils/types/listing";
import { NAV_HEIGHT } from "@/utils/constants";
import Head from "next/head";

export default function KilpailutuksetMap() {
  const apartmentQuery = useQueryKey({
    url: getAllListings,
    key: "all-listings",
  });

  const [listings, setListings] = useState({} as ApartmentMapBoxFmtFuncRet);

  useEffect(() => {
    if (!apartmentQuery.data) return;
    const data = getApartmentWithMapboxLayerFmt(
      apartmentQuery.data.res.payload
    );
    setListings(data);
  }, [apartmentQuery.data]);

  return (
    <>
      <Head>
        <title>Kaupax | Kartta</title>
      </Head>
      <div style={{ marginTop: NAV_HEIGHT }}>
        <MapWrapper listings={listings} />
      </div>
    </>
  );
}
