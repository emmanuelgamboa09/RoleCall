import { UserProvider } from "@auth0/nextjs-auth0";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import RollCall from "../components/rolecall";
import { store } from "../redux/store";
import theme from "../src/theme";
import "../styles/globals.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <RollCall>{getLayout(<Component {...pageProps} />)}</RollCall>
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default MyApp;
