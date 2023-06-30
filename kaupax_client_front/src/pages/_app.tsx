import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/auth";
import { LayoutProvider } from "@/context/layout";
import { ApartmentProvider } from "@/context/Map/apartment";
import { ToastProvider } from "@/context/toast";
import "@/styles/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { muiThemeExtends } from "../components/MuiWrappers/muiThemeExtend";
import { logPageView, initGA } from "../lib/ga";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  const [theme] = useState(
    createTheme({
      typography: {
        fontSize: 20,
      },
      ...muiThemeExtends,
    })
  );
  const gaInitiated = useRef(false);
  const [queryClient] = useState(new QueryClient());

  useEffect(() => {
    if (!gaInitiated.current) {
      initGA();
      gaInitiated.current = true;
    }
    logPageView();
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css"
          type="text/css"
        />
        <meta
          name="description"
          content="Vertaa kiinteistönvälittäjien tarjouksia ja löydä paras välittäjä asunnollesi, sijainnista riippumatta. Kaupax-palvelun avulla myyt kotisi helposti ja nopeasti. Lyhyesti helpoin tapa hankkia asunnollesi kiinteistönvälittäjä."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <SessionProvider session={session}>
              <LayoutProvider>
                <AuthProvider>
                  <Layout>
                    <ApartmentProvider>
                      <AnimatePresence
                        mode="wait"
                        initial={false}
                        onExitComplete={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        <Component {...pageProps} key={router.asPath} />
                      </AnimatePresence>
                    </ApartmentProvider>
                  </Layout>
                </AuthProvider>
              </LayoutProvider>
            </SessionProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
