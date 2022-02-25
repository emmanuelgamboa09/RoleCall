import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import RollCall from "../components/rolecall";
import { store } from "../redux/store";
import theme from "../src/theme";
import "../styles/globals.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

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
