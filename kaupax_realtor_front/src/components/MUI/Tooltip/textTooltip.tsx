import { Tooltip, Typography } from "@mui/material";
import { CSSProperties } from "react";

export default function TextTooltip({
  str,
  treshold = 20,
  strRender,
  tooltipTypographyStyles,
}: {
  str: string;
  treshold?: number;
  strRender: JSX.Element | string;
  tooltipTypographyStyles?: CSSProperties;
}) {
  if (str.length <= treshold) {
    return <>{str}</>;
  }

  return (
    <Tooltip title={strRender}>
      <Typography sx={tooltipTypographyStyles}>
        {str.slice(0, treshold) + "..."}
      </Typography>
    </Tooltip>
  );
}
