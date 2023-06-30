import ChatForBid from "@/components/ChatForBid";
import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import ConfirmDialog from "@/components/MuiWrappers/confirmDialog";
import { useAuth } from "@/context/auth";
import { useLayout } from "@/context/layout";
import { useToast } from "@/context/toast";
import { postReq } from "@/services/util";
import styleUtils from "@/styles/utils.module.css";
import { reactivateListingEndpoint } from "@/utils/endpoints";
import { Bid } from "@/utils/types/listing";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  bid: Bid;
  uuid: string;
  refetchListing: () => void;
}

export default function AcceptedOffer({ bid, uuid, refetchListing }: Props) {
  const setMaxWidth = useLayout().setLayoutMaxWidth;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setMaxWidth("1200px");

    return () => {
      setMaxWidth("1500px");
    };
  }, [setMaxWidth]);

  const reactivateListing = async () => {
    const { status } = await postReq({
      url: reactivateListingEndpoint(uuid),
      token: auth.accessToken as string,
    });

    if (status === 200) {
      toast.toastProps.openToast({
        message: "Kilpailutus on avattu uudestaan.",
        severity: "success",
      });
      refetchListing();
      router.push(`/ilmoitukset/${uuid}/tarjoukset`);
    } else {
      toast.toastProps.openToast({
        message: "Kilpailutuksen avaaminen epäonnistui.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <ConfirmDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        dialogTitle={"Varmista"}
        dialogContent={"Haluatko varmasti käynnistää kilpailutuksen uudestaan?"}
        cancelButtonText={"Peruuta"}
        acceptButtonText={"Kyllä"}
        acceptButtonColor={"primary"}
        handleAcceptCallback={reactivateListing}
      />
      <div>
        <PrimaryButton
          className={styleUtils.defaultButton}
          onClick={() => setConfirmDialogOpen(true)}
        >
          Avaa kilpailutus uudestaan
        </PrimaryButton>
        <h1 className={styleUtils.mainHeader} style={{ marginTop: "16px" }}>
          Olet hyväksynyt tarjouksen
        </h1>
        <p className={styleUtils.paragraph} style={{ marginTop: "6px" }}>
          Kiinteistönvälittäjä ottaa sinun yhteyttä pikimmiten. Jos haluat, voit
          olla myös suoraan yhteydessä kiinteistönvälittäjään.
        </p>

        <h2 className={styleUtils.mainHeader} style={{ marginTop: "32px" }}>
          Välittäjän tiedot
        </h2>

        <div className={styleUtils.whiteCardV2}>
          <p>{bid.Realtor.firstName + " " + bid.Realtor.surname}</p>
          <p>{bid.Realtor.email}</p>
          <p>{bid.Realtor.licencedAgent === true ? "LKV" : null}</p>
          <p>{bid.Realtor.phone}</p>
        </div>

        <div
          style={{
            marginTop: "32px",
            paddingRight: "0px",
            paddingLeft: "0px",
            padding: "32px",
            border: "2px solid #d7d7d7",
            borderRadius: "5px",
          }}
        >
          <ChatForBid bid={bid} refetchListing={refetchListing} />
        </div>

        <h2 className={styleUtils.paragraph} style={{ marginTop: "32px" }}>
          Tule kertomaan, jos toimeksianto johti kauppaan. Pääset mukaan
          jokakuukautiseen 250€ arvoiseen K-lahjakortti arvontaan.
        </h2>
      </div>
    </>
  );
}
