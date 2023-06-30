import { WHITE_TEXT } from "@/utils/constants";
import Typography from "@mui/material/Typography";
import { CSSProperties } from "react";
export default function TextSecondary({
  children,
  props,
}: {
  children: React.ReactNode;
  props?: CSSProperties;
}) {
  return (
    <Typography
      variant={"body2"}
      sx={props}
      color={WHITE_TEXT({ alpha: "0.7" })}
    >
      {children}
    </Typography>
  );
}
