import { Button } from "@/components/MuiWrappers/Buttons";
import ConfirmDialog from "@/components/MuiWrappers/confirmDialog";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { delReq } from "@/services/util";
import styles from "@/styles/invidualListing.module.css";
import styleUtils from "@/styles/utils.module.css";
import { useState } from "react";
import { listingUrl } from "@/utils/endpoints";
import { useRouter } from "next/router";

interface Props {
  address: string;
  bidCount: number;
  listingUUID: string;
}

export default function HeaderSection({
  address,
  bidCount,
  listingUUID,
}: Props) {
  const toast = useToast();
  const router = useRouter();
  const accessToken = useAuth().accessToken;
  const [dialogOpen, setDialogOpen] = useState(false);
  const removeListing = async () => {
    const { status } = await delReq({
      url: listingUrl(listingUUID),
      token: accessToken as string,
    });

    if (status === 200) {
      toast.toastProps.openToast({
        message: "Ilmoitus poistettu",
        severity: "success",
      });
      router.push("/");
    } else {
      toast.toastProps.openToast({
        message: "Ilmoituksen poistaminen epäonnistui",
        severity: "error",
      });
    }
  };
  return (
    <>
      <ConfirmDialog
        setOpen={setDialogOpen}
        open={dialogOpen}
        dialogTitle={"Haluatko varmasti poistaa kohteen kilpailutuksesta?"}
        dialogContent={"Jos haluat, että ilmoitus poistuu, paina kyllä"}
        acceptButtonText={"Kyllä"}
        cancelButtonText={"Ei"}
        handleAcceptCallback={removeListing}
        acceptButtonColor={"error"}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          rowGap: "16px",
          columnGap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              flexWrap: "wrap",
            }}
          >
            <h3 className={styles.headerSectionTitle}>{address}</h3>

            <div className={styles.outlinedGreyCard}>{bidCount} tarjousta</div>
          </div>

          <p
            className={styleUtils.paragraphExtraGrey}
            style={{ marginTop: "6px" }}
          >
            Asunnon {address} tarjoukset
          </p>
        </div>

        <div>
          <Button
            onClick={() => setDialogOpen(true)}
            style={{
              color: "#D32F2F",
              fontSize: "15px",
            }}
            className={styles.outlinedGreyCard}
          >
            Poista ilmoitus
          </Button>
        </div>
      </div>
    </>
  );
}
