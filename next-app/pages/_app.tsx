import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "@emotion/react";
import theme from "../src/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
