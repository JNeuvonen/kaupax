import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { getRealtorProfileDetailed } from "@/services/endpoints";
import styleUtils from "@/styles/utils.module.css";
import { BLUE_100, TEXT_GREY, WHITE_GREY } from "@/utils/constants";
import {
  convertFormattedDateToTimeElapsed,
  getTimeElapsed,
  linearlyScaleColorBasedOnValue,
} from "@/utils/functions";
import { useQueryKey } from "@/utils/tanstack";
import { Bid, Realtor } from "@/utils/types/realtor";
import Link from "next/link";

export default function VoitetutLeadit() {
  const accessToken = useAuth().accessToken;
  const realtorData = useQueryKey({
    key: "realtor-profile",
    accessToken: accessToken as string,
    url: getRealtorProfileDetailed,
  });

  if (!realtorData.data) {
    return <Spinner />;
  }

  const renderAcceptedBids = (bids: Bid[]) => {
    if (bids.length === 0) {
      return (
        <div
          style={{ color: WHITE_GREY, width: "100%" }}
          className={styleUtils.blackCard}
        >
          Kun saat ensimmäisen leadin, se ilmestyy tänne.
        </div>
      );
    }

    return (
      <>
        {bids.map((item, i) => {
          return <RenderWonLeadCard key={i} item={item} />;
        })}
      </>
    );
  };

  const renderPendingBids = (bids: Bid[]) => {
    if (bids.length === 0) {
      return (
        <div
          style={{ color: WHITE_GREY, width: "100%" }}
          className={styleUtils.blackCard}
        >
          Kun teet ensimmäisen tarjouksen, se ilmestyy tänne
        </div>
      );
    }

    return (
      <>
        {bids.map((item, i) => {
          return <RenderPendingBidCard key={i} item={item} />;
        })}
      </>
    );
  };

  const realtor = realtorData.data.res.data as Realtor;
  const acceptedBids = realtor.Bid.filter((bid) => bid.bidAccepted);
  const pendingBids = realtor.Bid.filter((bid) => !bid.bidAccepted);

  return (
    <div>
      <div>
        <h1 style={{ color: TEXT_GREY, fontSize: "30px" }}>Voitetut leadit</h1>

        {renderAcceptedBids(acceptedBids)}
      </div>

      <div style={{ marginTop: "32px" }}>
        <h1 style={{ color: TEXT_GREY, fontSize: "30px" }}>
          Tehdyt tarjoukset
        </h1>

        {renderPendingBids(pendingBids)}
      </div>
    </div>
  );
}

const RenderWonLeadCard = ({ item }: { item: Bid }) => {
  const timeElapsed = getTimeElapsed(new Date(item.updatedAt));
  const timeInMs = convertFormattedDateToTimeElapsed(timeElapsed);
  const color = linearlyScaleColorBasedOnValue({
    lowerBound: 0,
    upperBound: 1000 * 60 * 60 * 24 * 7,
    value: timeInMs,
    startColor: {
      r: 0,
      g: 255,
      b: 26,
    },
    endColor: {
      r: 255,
      g: 255,
      b: 255,
    },
  });
  return (
    <div
      style={{ color: WHITE_GREY, width: "100%" }}
      className={styleUtils.blackCard}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          columnGap: "16px",
          color: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      >
        {timeElapsed}
        <Link
          href={`/ilmoitus/${item.Listing.uuid}/tiedot`}
          style={{ color: BLUE_100 }}
        >
          Ilmoitukseen
        </Link>
      </div>

      <div style={{ marginTop: "16px" }}>
        {item.Listing.addressFull.replace(", Finland", "")} |{" "}
        {item.Listing.surfaceArea} neliötä
      </div>
      <div>Välityspalkkio: {item.comission}€</div>
      <div>Hintapyyntö: {item.price}€</div>
      <div>Puhelinnumero: {item.Listing.listersPhone}</div>
      <div>Sähköposti: {item.Listing.listersEmail}</div>
    </div>
  );
};

const RenderPendingBidCard = ({ item }: { item: Bid }) => {
  const timeElapsed = getTimeElapsed(new Date(item.updatedAt));
  const timeInMs = convertFormattedDateToTimeElapsed(timeElapsed);
  const color = linearlyScaleColorBasedOnValue({
    lowerBound: 0,
    upperBound: 1000 * 60 * 60 * 24 * 7,
    value: timeInMs,
    startColor: {
      r: 0,
      g: 255,
      b: 26,
    },
    endColor: {
      r: 255,
      g: 255,
      b: 255,
    },
  });
  return (
    <div
      style={{ color: WHITE_GREY, width: "100%" }}
      className={styleUtils.blackCard}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          columnGap: "16px",
          color: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      >
        {timeElapsed}
        <Link
          href={`/ilmoitus/${item.Listing.uuid}/tiedot`}
          style={{ color: BLUE_100 }}
        >
          Ilmoitukseen
        </Link>
      </div>

      <div style={{ marginTop: "16px" }}>
        {item.Listing.addressFull.replace(", Finland", "")} |{" "}
        {item.Listing.surfaceArea} neliötä
      </div>
      <div>Välityspalkkio: {item.comission}€</div>
      <div>Hintapyyntö: {item.price}€</div>
    </div>
  );
};
