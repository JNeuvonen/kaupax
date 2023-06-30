import ApartmentCarousel from "@/components/ApartmentCarousel/ApartmentCarousel";
import { ListingMapBoxFmt } from "@/utils/types/listing";
import { useRouter } from "next/router";
import React, { useContext, useMemo, useState } from "react";

type ApartmentContextType = {
  apartments: ListingMapBoxFmt[];
  setApartments: React.Dispatch<React.SetStateAction<ListingMapBoxFmt[]>>;
};

const ApartmentContext = React.createContext<ApartmentContextType>(
  {} as ApartmentContextType
);

export const ApartmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [apartments, setApartments] = useState<ListingMapBoxFmt[]>([]);

  const router = useRouter();

  const provider = useMemo(() => {
    return {
      apartments,
      setApartments,
    };
  }, [apartments]);

  return (
    <ApartmentContext.Provider value={provider}>
      {router.pathname && router.pathname === "/kilpailutukset/kartta" && (
        <ApartmentCarousel
          apartments={apartments}
          setApartments={setApartments}
        />
      )}
      {children}
    </ApartmentContext.Provider>
  );
};

export const useListing = () => useContext(ApartmentContext);
