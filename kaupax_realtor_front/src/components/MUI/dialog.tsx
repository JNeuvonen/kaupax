import { BLACK_200 } from "@/utils/constants";
import { Dialog } from "@mui/material";

export default function DialogWrapper({
  open,
  onClose,
  DialogTitle,
  DialogContent,
  DialogActions,
}: {
  open: boolean;
  onClose: () => void;
  DialogTitle?: JSX.Element;
  DialogContent?: JSX.Element;
  DialogActions?: JSX.Element;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      sx={{
        background: "rgba(255, 255, 255, 0.4)",
      }}
      PaperProps={{
        style: {
          backgroundColor: BLACK_200,
        },
        elevation: 10,
      }}
    >
      {DialogTitle}
      {DialogContent}
      {DialogActions}
    </Dialog>
  );
}
