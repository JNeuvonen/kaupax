declare module "@mui/material/styles" {
  // fix the type error when referencing the Theme object in your styled component
  interface Theme {
    custom?: {
      button?: {
        pillBorderRadius?: number;
      };
    };
  }
  // fix the type error when calling `createTheme()` with a custom theme option
  interface ThemeOptions {
    custom?: {
      button?: {
        pillBorderRadius?: number;
      };
    };
  }
}

export const muiThemeExtends = {
  custom: {
    button: {
      pillBorderRadius: 50,
    },
  },
};
