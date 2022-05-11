import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#850AD7",
      light: "#A123F5",
      dark: "#500682",
    },
    secondary: {
      main: "#574ae2ff",
      light: "#574ae2ff",
      dark: "#222a68ff",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ffb74d",
      light: "#ffa726",
      dark: "#f57c00",
    },
    info: {
      main: "#4fc3f7",
      light: "#29b6f6",
      dark: "#0288d1",
    },
    success: {
      main: "#81c784",
      light: "#66bb6a",
      dark: "#388e3c",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#263238",
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif;`,
  },
});

const grayTheme = createTheme({
  palette: {
    primary: {
      main: "#424242",
      light: "#6d6d6d",
      dark: "#1b1b1b",
    },
    secondary: {
      main: "#bdbdbd",
      light: "#efefef",
      dark: "#8d8d8d",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ffb74d",
      light: "#ffa726",
      dark: "#f57c00",
    },
    info: {
      main: "#4fc3f7",
      light: "#29b6f6",
      dark: "#0288d1",
    },
    success: {
      main: "#81c784",
      light: "#66bb6a",
      dark: "#388e3c",
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif;`,
  },
});
export default responsiveFontSizes(grayTheme);
