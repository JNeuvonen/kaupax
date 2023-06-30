import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { TextField } from "@mui/material";
import { CSSProperties } from "react";

interface Props {
  label: string;
  variant?: "standard" | "filled" | "outlined";
  helperText?: JSX.Element | string;
  sx?: CSSProperties;
  type?: string;
  error?: boolean;
  onChangeCallback?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  value?: string | number | undefined | null;
  disableResponsiveness?: boolean;
}

export default function TextFieldWrapper({
  label,
  variant,
  helperText,
  sx = {},
  error,
  id,
  onChangeCallback,
  type,
  value = "",
  disableResponsiveness = false,
}: Props) {
  const { width } = useWindowDimensions();
  return (
    <div>
      {!disableResponsiveness && width < 1000 && label}
      <TextField
        id={id}
        onChange={onChangeCallback}
        label={!disableResponsiveness && width < 1000 ? "" : label}
        variant={variant}
        helperText={helperText}
        sx={sx}
        value={value}
        error={error}
        type={type}
        size={!disableResponsiveness && width < 1000 ? "small" : "medium"}
        InputProps={{
          style: {
            fontSize: !disableResponsiveness && width < 1000 ? "22px" : "30px",
            marginTop: !disableResponsiveness && width < 1000 ? "7px" : "0px",
          },
        }}
      />
    </div>
  );
}
