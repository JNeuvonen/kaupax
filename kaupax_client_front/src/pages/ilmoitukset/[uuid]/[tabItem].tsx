import InvidualListing from "@/components/pages/Ilmoitukset/Ilmoitus";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { useLayout } from "@/context/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function IlmoitusUUID() {
  const router = useRouter();
  const auth = useAuth();
  const setLayoutMaxWidth = useLayout().setLayoutMaxWidth;
  const { uuid, tabItem } = router.query;

  useEffect(() => {
    return () => {
      setLayoutMaxWidth("1200px");
    };
  }, [setLayoutMaxWidth, tabItem]);

  if (!auth.accessToken || !uuid || !tabItem) {
    return (
      <>
        <Head>
          <title>Kaupax | Ilmoitus</title>
        </Head>
        <Spinner />;
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Kaupax | Ilmoitus</title>
      </Head>
      <InvidualListing
        auth={auth}
        uuid={uuid as string}
        tabItem={tabItem as string}
      />
    </>
  );
}
