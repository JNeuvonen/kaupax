import { Box, Button, IconButton, Snackbar } from "@mui/material";
import React, { SetStateAction } from "react";
import { Alert } from "./alert";
import CloseIcon from "@mui/icons-material/Close";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";

export default function SnackBar({
  open,
  setOpen,
  message,
  severity,
  autoHideDuration = 6000,
  extraButtonAction,
  alertEnabled = false,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  actionEnabled = false,
  closeEnabled = true,
  ctaText,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  autoHideDuration?: number;
  extraButtonAction?: () => void;
  alertEnabled: boolean;
  actionEnabled?: boolean;
  closeEnabled?: boolean;
  anchorOrigin?: any;
  ctaText: string;
}) {
  const { width } = useWindowDimensions();

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      {actionEnabled && (
        <Box onClick={extraButtonAction}>
          <Button
            color="secondary"
            size="small"
            onClick={handleClose}
            sx={{ fontSize: "15px" }}
          >
            {ctaText}
          </Button>
        </Box>
      )}
      {closeEnabled && (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </React.Fragment>
  );

  const renderAlert = () => {
    if (alertEnabled) {
      return (
        <Alert
          severity={severity}
          sx={{
            alignItems: "center",
          }}
        >
          {message}
          {closeEnabled && (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Alert>
      );
    }
  };

  const getAnchorOrigin = (): any => {
    if (width < 600) {
      return { vertical: "bottom", horizontal: "center" };
    }
    return anchorOrigin;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={getAnchorOrigin()}
      action={action}
      message={message}
    >
      {renderAlert()}
    </Snackbar>
  );
}
