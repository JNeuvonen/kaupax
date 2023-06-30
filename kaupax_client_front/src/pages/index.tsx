import Landing from "@/components/pages/Landing";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>
          Kilpailuta Kiinteistönvälittäjät - Löydä paras välittäjä asunnollesi
          Kaupaxin avulla
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing />
    </>
  );
}
