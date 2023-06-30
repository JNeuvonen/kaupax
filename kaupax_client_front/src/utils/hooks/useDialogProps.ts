import { useState } from "react";

export default function useDialogProps() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
