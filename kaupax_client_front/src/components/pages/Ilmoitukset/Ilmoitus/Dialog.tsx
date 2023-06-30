import ChatForBid from "@/components/ChatForBid";
import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import SnackBar from "@/components/MuiWrappers/snackbar";
import { useAuth } from "@/context/auth";
import { putReq } from "@/services/util";
import styleUtils from "@/styles/utils.module.css";
import { acceptBidEndpoint } from "@/utils/endpoints";
import useToastProps from "@/utils/hooks/useToastManager";
import { Bid } from "@/utils/types/listing";
import Dialog from "@mui/material/Dialog";
import React from "react";
import styles from "./Dialog.module.css";

interface DialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bid: Bid | null;
  showBidAcceptedToast: () => void;
  refetchListing: () => void;
}

export default function DialogWrapper({
  open,
  setOpen,
  bid,
  showBidAcceptedToast,
  refetchListing,
}: DialogProps) {
  const realtor = bid?.Realtor;
  const auth = useAuth();
  const toastProps = useToastProps();

  async function acceptBid() {
    const { status } = await putReq({
      token: auth.accessToken as string,
      url: acceptBidEndpoint(bid?.id as number),
    });

    if (status === 200) {
      showBidAcceptedToast();
      setOpen(false);
    } else {
      toastProps.openToast({
        message: `Tarjouksen hyväksyminen epäonnistui.`,
        severity: "error",
      });
    }
  }

  if (!realtor) return null;

  return (
    <>
      <SnackBar {...toastProps} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={"xl"}
        fullWidth={true}
      >
        <div className={styles.contentContainer}>
          <div className={styles.headerContainer}>
            <div className={styles.img}>
              <img
                className={styles.img}
                src={realtor.profilePicture as any}
                alt={"ei kuvaa"}
              />
            </div>

            <div>
              <h2 className={styles.headerTitle}>
                {realtor.firstName} {realtor.surname}
              </h2>

              <div
                style={{
                  marginTop: "2px",
                  display: "flex",
                  columnGap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <p className={styleUtils.paragraph}>
                  {realtor.entreprenur ? "Yrittäjä, " : "Työntekijä, "}
                  {realtor.company}
                  {realtor.licencedAgent ? ", LKV" : ""}
                </p>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  columnGap: "16px",
                  flexWrap: "wrap",
                  rowGap: "16px",
                }}
              >
                <PrimaryButton
                  className={styles.buttonFontSize}
                  style={{
                    fontSize: "15px",
                    padding: "5px 14px",
                    textTransform: "capitalize",
                  }}
                  onClick={acceptBid}
                >
                  Hyväksy tarjous
                </PrimaryButton>
              </div>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.bodyContainer}>
              <div className={styles.detailsContainer}>
                <div>
                  <h4 className={styles.detailsMiniHeader}>Välityspalkkio</h4>
                  <p className={styleUtils.paragraph}>{bid.comission}€</p>
                </div>

                <div style={{ marginTop: "32px" }}>
                  <h4 className={styles.detailsMiniHeader}>Pyyntihinta</h4>
                  <p className={styleUtils.paragraph}>{bid.price}€</p>
                </div>
              </div>

              <div
                className={styles.messageBox}
                style={{ paddingBottom: "35px" }}
              >
                <ChatForBid bid={bid} refetchListing={refetchListing} />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
