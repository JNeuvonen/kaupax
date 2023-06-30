import React, { useState } from "react";
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
    severity: "success" | "error" | "info" | "warning";
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

  const openToast = ({
    message,
    severity,
    ctaText = "",
  }: {
    message: string;
    severity: "success" | "error" | "info" | "warning";
    ctaText?: string;
  }) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
    setCtaText(ctaText);
  };

  return {
    message,
    setMessage,
    open,
    setOpen,
    openToast,
    severity,
    ctaText,
  };
}
