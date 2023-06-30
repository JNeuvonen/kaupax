import SnackBar from "@/components/MuiWrappers/snackbar";
import Spinner from "@/components/Spinner";
import { AuthContext } from "@/context/auth";
import { postReq, putReq } from "@/services/util";
import styles from "@/styles/listingDetails.module.css";
import styleUtils from "@/styles/utils.module.css";
import { listingUrl } from "@/utils/endpoints";
import useToastProps from "@/utils/hooks/useToastManager";
import { useQueryKey } from "@/utils/tanstack";
import { Bid, Listing } from "@/utils/types/listing";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

interface Props {
  uuid: string;
  auth: AuthContext;
}

export default function ListingDetails({ uuid, auth }: Props) {
  const toastProps = useToastProps();

  const [listing, setListing] = useState<Listing | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  const listingQuery = useQueryKey({
    key: "listing",
    url: listingUrl(uuid as string),
    accessToken: auth?.accessToken as string,
  });

  const acceptBid = async (bid: Bid) => {
    const url = listingUrl(listing?.uuid as string) + "/accept";

    setPageLoading(true);
    const { res, status } = await postReq({
      url,
      token: auth?.accessToken as string,
      queryParams: [{ key: "bidId", value: String(bid.id) }],
    });

    if (status === 200) {
      toastProps.openToast({
        message: `Tarjous hyväksytty`,
        severity: "success",
      });
      setListing(res.payload);
      setPageLoading(false);
    } else {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      if (listingQuery.data) {
        const { res, status } = listingQuery.data;

        if (status === 200) {
          const { payload }: { payload: Listing } = res;

          setListing(payload);

          if (!payload.congratulationsMessageSent) {
            toastProps.openToast({
              message: `Ilmoituksesi on tehty`,
              severity: "success",
            });

            await putReq({
              url: listingUrl(uuid) + "/saw",
              token: auth?.accessToken as string,
            });
          }
        }
      }
    };

    asyncWrapper();
  }, [listingQuery.data]);

  if (!listing || pageLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ marginTop: "5vh" }}>
      <SnackBar {...toastProps} autoHideDuration={10000} alertEnabled={false} />
      <Header listing={listing} />
      <RenderOffers listing={listing} acceptBid={acceptBid} />
      <RenderDetailsTable listing={listing} />
    </div>
  );
}

interface HeaderProps {
  listing: Listing;
}

const Header = ({ listing }: HeaderProps) => {
  const acceptedBidDetails = () => {
    const acceptedBid = listing.Bid.find(
      (bid) => bid.id === listing.acceptedBidId
    );

    if (!acceptedBid) {
      return null;
    }

    return (
      <div>
        <h3>Hyväksytyn tarjouksen tiedot</h3>
        Hinta: {acceptedBid.price}
      </div>
    );
  };

  if (!listing.isActive) {
    return (
      <div>
        <div>
          <h3 className={styles.mainTitle + " " + styleUtils.mainHeader}>
            Hyväksyit tarjouksen!
          </h3>

          <p className={styleUtils.paragraph}>
            Keskusteluyhteys on avattu teidän ja välittäjän välille. Voit
            laittaa hänelle viestiä tästä.
          </p>
        </div>

        <div>{acceptedBidDetails()}</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h3 className={styles.mainTitle + " " + styleUtils.mainHeader}>
          Kiitos ilmoituksestasi!
        </h3>

        <p className={styleUtils.paragraph}>
          Lähetämme sähköposti -ja tekstiviestimuistutuksia välittäjien
          tarjouksista.
        </p>
      </div>
    </div>
  );
};

const RenderDetailsTable = ({ listing }: { listing: Listing }) => {
  if (!listing.isActive) {
    return null;
  }
  return (
    <>
      <div className={styles.infoDiv}>
        <h4 className={styles.secondaryTitle + " " + styleUtils.mainHeader}>
          Ilmoituksen tiedot
        </h4>
        <div
          className={
            styleUtils.whiteCard + " " + styles.infoCard + " " + styles.details
          }
        >
          <RenderInfoRow label="Asunnon tyyppi" value={listing.listingType} />
          <RenderInfoRow label="Paikkakunta" value={listing.locality} />
          <RenderInfoRow label="Osoite" value={listing.addressFull} />
          <RenderInfoRow label="Neliöiden määrä" value={listing.surfaceArea} />
          <RenderInfoRow label="Arvio kunnosta" value={listing.condition} />
          <RenderInfoRow label="Vapaa kuvaus" value={listing.freeDescription} />
          <RenderInfoRow
            label="Toimeksiannon tavoite"
            value={listing?.objective}
          />
          <RenderInfoRow label="Tavoitehinta" value={listing?.objective} />
          <RenderInfoRow label="Kerros" value={listing?.floor} />
        </div>
      </div>
      <div className={styles.infoDiv}>
        <h4 className={styles.secondaryTitle + " " + styleUtils.mainHeader}>
          Kuvat
        </h4>

        <Button>Lisää kuvia</Button>
      </div>
    </>
  );
};

const RenderInfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) => {
  const renderValue = () => {
    if (!value) {
      return <Button sx={{ padding: 0, fontSize: "18px" }}>Lisää</Button>;
    }

    return value;
  };
  return (
    <div className={styles.infoRow}>
      <div>{label}</div>
      <div>{renderValue()}</div>
    </div>
  );
};

interface RenderOfferProps {
  listing: Listing;
  acceptBid: (bid: Bid) => void;
}
const RenderOffers = ({ listing, acceptBid }: RenderOfferProps) => {
  if (!listing.isActive) {
    return null;
  }
  const renderOffers = () => {
    if (listing.Bid.length === 0) {
      return (
        <p className={styleUtils.paragraph}>
          Kun saat tarjouksia, ne ilmestyvät tähän.
        </p>
      );
    }

    return (
      <>
        {listing.Bid.map((item) => {
          return (
            <div key={item.id} className={styles.bidRow}>
              <div>750000</div>
              <div>
                <Button onClick={() => acceptBid(item)}> Hyväksy</Button>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className={styles.infoDiv}>
      <h4 className={styles.secondaryTitle + " " + styleUtils.mainHeader}>
        Tarjoukset
      </h4>

      <div className={styleUtils.whiteCard + " " + styles.infoCard}>
        {renderOffers()}
      </div>
    </div>
  );
};
