import MuiButton, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface StyledMuiButtonProps extends ButtonProps {
  pill?: boolean;
}

export const Button = styled(MuiButton)<StyledMuiButtonProps>(
  ({ theme, pill }) => ({
    borderRadius: pill
      ? theme.custom?.button?.pillBorderRadius
      : theme.shape.borderRadius,
  })
);
