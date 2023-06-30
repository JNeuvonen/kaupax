import Layout from "@/components/Layout";
import { muiThemeExtends } from "@/components/MUI/theme";
import { ApartmentProvider } from "@/context/apartment";
import { AuthProvider } from "@/context/auth";
import { LayoutProvider } from "@/context/layout";
import "@/styles/globals.css";
import "@/styles/geocoder.css";
import "@/styles/mapboxGL.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ToastProvider } from "@/context/toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [theme] = useState(
    createTheme({
      typography: {
        fontSize: 20,
      },
      ...muiThemeExtends,
    })
  );
  const [queryClient] = useState(new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            <ToastProvider>
              <LayoutProvider>
                <AuthProvider>
                  <ApartmentProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </ApartmentProvider>
                </AuthProvider>
              </LayoutProvider>
            </ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
