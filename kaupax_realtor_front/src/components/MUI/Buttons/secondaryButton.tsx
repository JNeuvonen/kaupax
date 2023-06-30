import { PRIMARY_BLUE_300 } from "@/utils/constants";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface StyledMuiButtonProps extends ButtonProps {
  pill?: boolean;
}
export const SecondaryButton = styled(MuiButton)<StyledMuiButtonProps>(
  ({ theme, pill }) => ({
    borderRadius: pill
      ? theme.custom?.button?.pillBorderRadius
      : theme.shape.borderRadius,
    background: "white",
    border: `1px solid ${PRIMARY_BLUE_300}`,
    color: PRIMARY_BLUE_300,
    "&:hover": {
      backgroundColor: "#0a32a3",
      color: "white",
    },
  })
);
