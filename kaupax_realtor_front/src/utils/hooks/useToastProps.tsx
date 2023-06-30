import { useState } from "react";
export type Severity = "success" | "error" | "info" | "warning";

export interface useToastPropsTypes {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openToast: ({
    message,
    severity,
    ctaText,
  }: {
    message: string;
    severity: Severity;
    ctaText?: string | undefined;
  }) => void;
  severity: Severity;
  ctaText: string;
}

export default function useToastProps() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<Severity>("success");
  const [ctaText, setCtaText] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [anchorOrigin, setAnchorOrigin] = useState({
    vertical: "bottom",
    horizontal: "left",
  });

  const openToast = ({
    message,
    severity,
    ctaText = "",
    alert = false,
    anchorOrigin = {
      vertical: "bottom",
      horizontal: "left",
    },
  }: {
    message: string;
    severity: "success" | "error" | "info" | "warning";
    ctaText?: string;
    alert?: boolean;
    anchorOrigin?: {
      vertical: "top" | "bottom";
      horizontal: "left" | "center" | "right";
    };
  }) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
    setCtaText(ctaText);
    setAlertEnabled(alert);
    setAnchorOrigin(anchorOrigin);
  };

  return {
    message,
    setMessage,
    open,
    setOpen,
    openToast,
    severity,
    ctaText,
    alertEnabled,
    setAlertEnabled,
    anchorOrigin,
    setAnchorOrigin,
  };
}
