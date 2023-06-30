import { useListing } from "@/context/Map/apartment";
import { CondoIcon } from "@/utils/icons";
import { ListingMapBoxFmt } from "@/utils/types/listing";
import { useState } from "react";
import { Marker } from "react-map-gl";

interface ApartmentMarketProps {
  longitude: number;
  latitude: number;
  apartment: ListingMapBoxFmt;
}

export default function ApartmentMarker({
  longitude,
  latitude,
  apartment,
}: ApartmentMarketProps) {
  const [hover, setHover] = useState(false);
  const setApartments = useListing().setApartments;
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={() => {
        setApartments([apartment]);
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ color: "#F2BA18", textAlign: "center" }}></span>
        <CondoIcon width={35} fill={hover ? "red" : "#F2BA18"} />
      </div>
    </Marker>
  );
}
