import Tooltip from "@mui/material/Tooltip";

interface TooltipProps {
  hint: React.ReactNode | string;
  children: JSX.Element;
}

export default function TooltipWrapper({ hint, children }: TooltipProps) {
  return <Tooltip title={hint}>{children}</Tooltip>;
}
