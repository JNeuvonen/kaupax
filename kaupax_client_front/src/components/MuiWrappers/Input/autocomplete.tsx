import { Autocomplete, TextField } from "@mui/material";
import { CSSProperties } from "react";

interface Props {
  value: any;
  setValue: any;
  getOptionLabel: (obj: object) => string;
  options: Array<object>;
  renderOptionCallback: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any
  ) => JSX.Element;
  noOptionsText: string;
  id: string;
  inputLabel: string;
  helperText: any;
  inputSxProps?: CSSProperties;
  textfieldSxProps?: CSSProperties;
  textfieldVariant?: "standard" | "filled" | "outlined";
  textfieldInError: boolean | undefined;
  formikSetFieldValue?: any;
  className?: string;
}

export default function InputAutoComplete({
  setValue,
  value,
  getOptionLabel,
  options,
  renderOptionCallback,
  noOptionsText,
  id,
  inputLabel,
  helperText,
  inputSxProps = { width: "100%" },
  textfieldSxProps = { height: "100px" },
  textfieldVariant = "filled",
  formikSetFieldValue = false,
  textfieldInError,
  className,
}: Props) {
  return (
    <>
      <Autocomplete
        id={id}
        noOptionsText={noOptionsText}
        getOptionLabel={getOptionLabel}
        options={options}
        value={value}
        sx={inputSxProps}
        onChange={(_event: any, newValue: any) => {
          setValue(newValue);
          if (formikSetFieldValue) {
            formikSetFieldValue(id, newValue);
          }
        }}
        renderInput={(params: any) => {
          return (
            <TextField
              {...params}
              label={inputLabel}
              variant={textfieldVariant}
              helperText={helperText}
              sx={textfieldSxProps}
              error={textfieldInError}
              className={className}
            />
          );
        }}
        renderOption={(props, option) => {
          return renderOptionCallback(props, option);
        }}
      />
    </>
  );
}
