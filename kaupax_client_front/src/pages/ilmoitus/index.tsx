import CreateListing from "@/components/pages/CreateListing";
import { motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";

export default function Ilmoitus() {
  const [exitAnimation, setExitAnimation] = useState(false);
  return (
    <>
      <Head>
        <title>Kaupax | Uusi Ilmoitus</title>
      </Head>
      <motion.div
        animate={{ x: 0, opacity: 1 }}
        exit={exitAnimation ? { x: 500, opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        <CreateListing setExitAnimation={setExitAnimation} />
      </motion.div>
    </>
  );
}
