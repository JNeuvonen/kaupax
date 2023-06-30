import { NEUTRAL_GREY_50, PRIMARY_BLUE_500 } from "@/utils/constants";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface StyledMuiButtonProps extends ButtonProps {
  pill?: boolean;
}
export const PrimaryButton = styled(MuiButton)<StyledMuiButtonProps>(
  ({ theme, pill }) => ({
    borderRadius: pill
      ? theme.custom?.button?.pillBorderRadius
      : theme.shape.borderRadius,
    backgroundColor: PRIMARY_BLUE_500,
    "&:hover": {
      backgroundColor: "#0a32a3",
    },
    color: NEUTRAL_GREY_50,
  })
);
