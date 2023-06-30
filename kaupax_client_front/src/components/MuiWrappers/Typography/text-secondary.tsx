import { Typography } from "@mui/material";
import { CSSProperties } from "react";

export default function TypographySecondary({
  children,
  props,
  className,
}: {
  children: string;
  props?: CSSProperties;
  className?: string;
}) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={props}
      className={className}
    >
      {children}
    </Typography>
  );
}
