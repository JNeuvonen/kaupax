import DialogWrapper from "@/components/MUI/dialog";
import SnackBar from "@/components/MUI/snackbar";
import { bidUrl } from "@/services/endpoints";
import { delReq, postReq } from "@/services/util";
import {
  BLUE_100,
  BORDER_SUBTLE,
  PURPLE_100,
  WHITE_TEXT,
} from "@/utils/constants";
import useToastProps from "@/utils/hooks/useToastProps";
import { Apartment } from "@/utils/types/apartment";
import { Bid, Realtor } from "@/utils/types/realtor";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useCallback, useState } from "react";
import OffersTable, { getRealtorBid } from "./offersTable";

export default function OffersTab({
  apartment,
  accessToken,
  realtor,
}: {
  apartment: Apartment;
  accessToken: string;
  realtor: Realtor;
}) {
  const toastProps = useToastProps();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comissionMissing, setComissionMissing] = useState(false);
  const [priceMissing, setPriceMissing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [, updateState] = useState(0);
  const forceUpdate = useCallback(
    () => updateState(Math.random() * Number.MAX_SAFE_INTEGER),
    []
  );

  const sendForm = async ({ editing = false }: { editing?: boolean }) => {
    const komissio = document.getElementById(
      "komissio-input"
    ) as HTMLInputElement;
    const pyyntihinta = document.getElementById(
      "pyyntihinta-input"
    ) as HTMLInputElement;

    const message = document.getElementById(
      "message-input"
    ) as HTMLInputElement;

    if (komissio.value === "") {
      setComissionMissing(true);
    } else {
      setComissionMissing(false);
    }

    if (pyyntihinta.value === "") {
      setPriceMissing(true);
    } else {
      setPriceMissing(false);
    }

    if (komissio.value !== "" && pyyntihinta.value !== "") {
      setDialogOpen(false);

      setFetching(true);

      const { status, res } = await postReq({
        url: bidUrl(apartment.uuid),
        token: accessToken,
        payload: {
          comission: komissio.value,
          price: pyyntihinta.value,
          message: message.value,
        },
      });

      if (status === 200) {
        setFetching(false);

        if (editing) {
          const bid = apartment.Bid.find(
            (bid: any) => bid.realtorId === realtor.id
          );

          if (bid) {
            bid.comission = Number(komissio.value);
            bid.price = Number(pyyntihinta.value);
            bid.message = message.value;
          }

          const realtorBid = realtor.Bid.find(
            (bid: Bid) => bid.realtorId === realtor.id
          );
          if (realtorBid) {
            realtorBid.comission = Number(komissio.value);
            realtorBid.price = Number(pyyntihinta.value);
            realtorBid.message = message.value;
          }
        } else {
          apartment.Bid.push(res.payload);
          realtor.Bid.push(res.payload);
        }
        toastProps.openToast({
          message: `Tarjouksesi on tehty`,
          severity: "success",
          ctaText: "Muokkaa",
        });
        forceUpdate();
      } else {
        setFetching(false);
      }
    }
  };

  const deleteBid = async () => {
    const bid = apartment.Bid.find(
      (bid: any) => bid.realtorId === realtor.id
    ) as any;
    setFetching(true);
    setDialogOpen(false);

    const { status } = await delReq({
      url: bidUrl(String(bid.id)),
      token: accessToken,
    });

    if (status === 200) {
      setFetching(false);

      apartment.Bid = apartment.Bid.filter(
        (bid: any) => bid.realtorId !== realtor.id
      );

      realtor.Bid = realtor.Bid.filter(
        (bid: Bid) => bid.realtorId !== realtor.id
      );

      toastProps.openToast({
        message: `Tarjouksesi on poistettu`,
        severity: "success",
        ctaText: "Muokkaa",
      });
    } else {
      setFetching(false);
    }
  };

  const realtorBid = getRealtorBid({ realtor, apartment });

  return (
    <>
      <SnackBar
        {...toastProps}
        autoHideDuration={10000}
        alertEnabled={false}
        closeEnabled={true}
      />

      <Box
        sx={{
          padding: "24px",
          border: `2px solid ${BORDER_SUBTLE}`,
          borderRadius: "5px",
          color: WHITE_TEXT({ alpha: "1" }),
        }}
      >
        <OffersTable
          isFetching={fetching}
          apartment={apartment}
          realtor={realtor}
          setDialogOpen={setDialogOpen}
        />
      </Box>
      <DialogWrapper
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        DialogTitle={<DialogTitleWrapper realtorBid={realtorBid} />}
        DialogContent={
          <DialogContentWrapper
            comissionMissing={comissionMissing}
            priceMissing={priceMissing}
            realtorBid={realtorBid}
          />
        }
        DialogActions={
          <DialogActionsWrapper
            close={() => setDialogOpen(false)}
            send={sendForm}
            realtorBid={realtorBid}
            deleteBid={deleteBid}
          />
        }
      />
    </>
  );
}

const DialogTitleWrapper = ({ realtorBid }: { realtorBid?: Bid | null }) => {
  if (realtorBid) {
    return <DialogTitle color={"white"}>Muokkaa tarjousta</DialogTitle>;
  }
  return <DialogTitle color={"white"}>Tarjous</DialogTitle>;
};

const DialogContentWrapper = ({
  comissionMissing,
  priceMissing,
  realtorBid,
}: {
  comissionMissing: boolean;
  priceMissing: boolean;
  realtorBid?: Bid | null;
}) => {
  return (
    <DialogContent>
      <Box>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="komissio-input">
            <Typography color={"white"}>Välityspalkkio</Typography>
          </InputLabel>
          <Input
            id="komissio-input"
            error={comissionMissing}
            type={"number"}
            defaultValue={realtorBid?.comission}
            sx={{
              color: "white",
            }}
            startAdornment={
              <InputAdornment position="start">
                <Typography color={"white"}>€</Typography>
              </InputAdornment>
            }
          />

          {comissionMissing && (
            <Typography fontSize={"15px"} color={"red"}>
              Välityspalkkio on pakollinen tieto
            </Typography>
          )}
        </FormControl>
      </Box>

      <Box sx={{ marginTop: "32px" }}>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="pyyntihinta-input">
            <Typography color={"white"}>Pyyntihinta</Typography>
          </InputLabel>
          <Input
            error={priceMissing}
            id="pyyntihinta-input"
            type={"number"}
            defaultValue={realtorBid?.price}
            sx={{
              color: "white",
            }}
            startAdornment={
              <InputAdornment position="start">
                <Typography color={"white"}>€</Typography>
              </InputAdornment>
            }
          />

          {priceMissing && (
            <Typography fontSize={"15px"} color={"red"}>
              Pyyntihinta on pakollinen tieto
            </Typography>
          )}
        </FormControl>
        <Box sx={{ paddingLeft: "7px" }}>
          <Typography color={"white"}>Vapaa viesti</Typography>
          <textarea
            id={"message-input"}
            defaultValue={realtorBid?.message}
            style={{
              background: "inherit",
              padding: "10px",
              color: "white",
              width: "100%",
              height: "200px",
            }}
          ></textarea>
        </Box>
      </Box>
    </DialogContent>
  );
};

const DialogActionsWrapper = ({
  close,
  send,
  deleteBid,
  realtorBid,
}: {
  close: () => void;
  send: ({ editing }: { editing?: boolean }) => void;
  deleteBid: () => void;
  realtorBid: Bid | null;
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (!realtorBid) {
    return (
      <DialogActions>
        <Button onClick={close} sx={{ color: BLUE_100 }}>
          Peruuta
        </Button>
        <Button
          onClick={() => send({ editing: false })}
          sx={{ color: BLUE_100 }}
        >
          Lähetä
        </Button>
      </DialogActions>
    );
  }
  return (
    <>
      <Dialog
        open={open}
        maxWidth={"xs"}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"    Haluatko varmasti poistaa tarjouksen?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>En</Button>
          <Button onClick={deleteBid} autoFocus>
            Kyllä
          </Button>
        </DialogActions>
      </Dialog>

      <DialogActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingLeft: "14px",
            paddingRight: "14px",
          }}
        >
          {realtorBid && (
            <Box>
              <Button
                onClick={handleClickOpen}
                sx={{ color: PURPLE_100, fontSize: "17px" }}
              >
                Poista tarjous
              </Button>
            </Box>
          )}
          <Box>
            <Button onClick={close} sx={{ color: BLUE_100, fontSize: "17px" }}>
              Peruuta
            </Button>
            <Button
              onClick={() => send({ editing: true })}
              sx={{ color: BLUE_100, fontSize: "17px" }}
            >
              Lähetä
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </>
  );
};
