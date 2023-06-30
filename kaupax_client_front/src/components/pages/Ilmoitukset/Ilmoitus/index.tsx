import ContentSection from "@/components/ContentSection";
import SnackBar from "@/components/MuiWrappers/snackbar";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import { AuthContext } from "@/context/auth";
import styleUtils from "@/styles/utils.module.css";
import { getListingDetailed } from "@/utils/endpoints";
import {
  convertFormattedDateToTimeElapsed,
  getTimeElapsed,
} from "@/utils/functions";
import useToastProps from "@/utils/hooks/useToastManager";
import { GreenCircle, RedCircle, YellowCircle } from "@/utils/icons";
import { useQueryKey } from "@/utils/tanstack";
import { ListingDetailed } from "@/utils/types/listing";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AcceptedOffer from "./AcceptedOffer";
import ApartmentDetails from "./ApartmentDetails";
import HeaderSection from "./HeaderSection";
import OffersTable from "./OffersTable";

interface Props {
  auth: AuthContext;
  uuid: string;
  tabItem: string;
}

export default function InvidualListing({ auth, uuid, tabItem }: Props) {
  const toastProps = useToastProps();
  const [exitAnimation, setExitAnimation] = useState(false);

  const router = useRouter();
  const detailedListing = useQueryKey({
    key: "detailed-listing",
    url: getListingDetailed(uuid),
    accessToken: auth.accessToken as string,
    staleTime: 60000 * 5,
  });

  useEffect(() => {
    detailedListing.refetch();
  }, []);

  function showBidAcceptedToast() {
    toastProps.openToast({
      message: `Tarjous hyväksyttiin.`,
      severity: "success",
    });
    router.push(`/ilmoitukset/${uuid}/kiitos`);
    setExitAnimation(true);

    setTimeout(() => {
      setExitAnimation(false);
    }, 1000);
  }

  if (!detailedListing.data) {
    return <Spinner />;
  }

  const refetchListing = () => {
    detailedListing.refetch();
  };

  const listing = detailedListing.data.res.payload as ListingDetailed;

  const getIconForLatestOffer = () => {
    if (listing.Bid.length === 0) {
      return "Ensimmäistä tarjousta ei ole vielä tehty";
    }
    const sortedBids = listing.Bid.sort((a, b) => {
      const aDate = new Date(String(a.updatedAt)) as any;
      const bDate = new Date(String(b.updatedAt)) as any;
      return bDate - aDate;
    });

    const timeElapsed = getTimeElapsed(new Date(sortedBids[0].updatedAt));
    const timeInMs = convertFormattedDateToTimeElapsed(timeElapsed);

    const oneDayInMs = 86400000;
    const getCircle = () => {
      if (timeInMs <= oneDayInMs) {
        return <GreenCircle width={20} />;
      }

      if (timeInMs <= oneDayInMs * 3) {
        return <YellowCircle width={20} />;
      }

      return <RedCircle width={20} />;
    };

    if (listing.acceptedBidId) {
      return (
        <>
          <RedCircle width={20} /> <span>Kilpailutus on päättynyt.</span>
        </>
      );
    }

    return (
      <>
        {getCircle()}
        <span>Viimeisin tarjous jätetty: {timeElapsed}</span>
      </>
    );
  };

  const getPageContent = () => {
    if (tabItem === "tarjoukset") {
      return (
        <div style={{ marginTop: "25px" }}>
          <OffersTable
            bids={listing.Bid}
            showAcceptedBidToast={showBidAcceptedToast}
            refetchListing={refetchListing}
          />
        </div>
      );
    }

    if (tabItem === "tiedot") {
      return (
        <div style={{ marginTop: "25px" }}>
          <ApartmentDetails
            listing={listing}
            refetchListing={detailedListing.refetch}
          />
        </div>
      );
    }

    if (tabItem === "kiitos") {
      const acceptedBid = listing.Bid.find((item) => item.bidAccepted);

      if (!acceptedBid) {
        detailedListing.refetch();
      } else {
        return (
          <div style={{ marginTop: "25px" }}>
            <AcceptedOffer
              bid={acceptedBid}
              uuid={uuid}
              refetchListing={detailedListing.refetch}
            />
          </div>
        );
      }
    }

    return (
      <div>
        <Spinner />
      </div>
    );
  };

  const bidIsAccepted =
    listing.Bid.find((item) => item.bidAccepted) !== undefined ? true : false;

  let tabItems = TabsItems;

  if (bidIsAccepted) {
    const alreadyFound =
      tabItems.find((item) => item.link === "Hyväksytty tarjous") !== undefined
        ? true
        : false;

    if (!alreadyFound) {
      tabItems.push({
        link: "Hyväksytty tarjous",
        href: "/kiitos",
      });
    }
  } else {
    tabItems = tabItems.filter((item) => item.link !== "Hyväksytty tarjous");
  }

  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      exit={exitAnimation ? { x: 500, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <SnackBar {...toastProps} />
      <Box>
        <ContentSection>
          <Box sx={{ marginTop: "50px" }}>
            <HeaderSection
              address={listing.addressFull}
              bidCount={listing.Bid.length}
              listingUUID={listing.uuid}
            />
          </Box>
          <div
            style={{
              marginTop: "22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              rowGap: "10px",
              columnGap: "32px",
            }}
          >
            <Tabs
              tabItems={tabItems}
              currentTabItem={tabItem}
              breakpoint={1000}
            />
            <div
              className={styleUtils.paragraphExtraGrey}
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
                fontSize: "14px",
              }}
            >
              {getIconForLatestOffer()}
            </div>
          </div>

          {getPageContent()}
        </ContentSection>
      </Box>
    </motion.div>
  );
}

const TabsItems = [
  {
    link: "Kiinteistönvälittäjien tarjoukset",
    href: "/tarjoukset",
  },
  {
    link: "Asunnon tiedot",
    href: "/tiedot",
  },
];
