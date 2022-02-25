import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "@emotion/react";
import theme from "../src/theme";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { NextPage } from "next";
import RollCall from "../components/rolecall";

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <RollCall>{getLayout(<Component {...pageProps} />)}</RollCall>
        </Provider>
      </ThemeProvider>
    </UserProvider>
  );
}

export default MyApp;
