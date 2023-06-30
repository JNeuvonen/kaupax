import ApartmentsCarousel from "@/components/ApartmentsCarousel";
import { ApartmentMapBoxFmt } from "@/utils/types/apartment";
import React, { useContext, useMemo, useState } from "react";

type ApartmentContextType = {
  apartments: ApartmentMapBoxFmt[];
  setApartments: React.Dispatch<React.SetStateAction<ApartmentMapBoxFmt[]>>;
};

const ApartmentContext = React.createContext<ApartmentContextType>(
  {} as ApartmentContextType
);

export const ApartmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [apartments, setApartments] = useState<ApartmentMapBoxFmt[]>([]);

  const provider = useMemo(() => {
    return {
      apartments,
      setApartments,
    };
  }, [apartments]);

  return (
    <ApartmentContext.Provider value={provider}>
      {window.location.pathname === "/kilpailutukset/kartta" && (
        <ApartmentsCarousel
          apartments={apartments}
          setApartments={setApartments}
        />
      )}
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartment = () => useContext(ApartmentContext);
