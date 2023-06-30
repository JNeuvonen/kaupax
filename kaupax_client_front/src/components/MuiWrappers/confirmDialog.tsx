import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogContent: string;
  dialogTitle: string;
  cancelButtonText: string;
  acceptButtonText: string;
  handleAcceptCallback: () => void;
  acceptButtonColor?: "primary" | "secondary" | "error" | "info" | "success";
}

export default function ConfirmDialog({
  open,
  setOpen,
  dialogContent,
  dialogTitle,
  cancelButtonText,
  acceptButtonText,
  handleAcceptCallback,
  acceptButtonColor = "primary",
}: Props) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{cancelButtonText}</Button>
        <Button
          onClick={handleAcceptCallback}
          autoFocus
          color={acceptButtonColor}
        >
          {acceptButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
