import ContentSection from "@/components/ContentSection";
import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import { useToast } from "@/context/toast";
import styleUtils from "@/styles/utils.module.css";
import Head from "next/head";
import { useRef } from "react";

export default function ContactPage() {
  const toast = useToast();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = () => {
    toast.toastProps.openToast({
      message: "Viestisi on lähetetty.",
      severity: "success",
    });

    if (!inputRef.current) return null;
    const input = inputRef.current as HTMLTextAreaElement;
    input.value = "";
  };
  return (
    <>
      <Head>
        <title>Kaupax | Ota Yhteyttä</title>
      </Head>
      <ContentSection>
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <h1 className={styleUtils.mainHeader}>
            Haluatko lähettää meille viestin?
          </h1>

          <textarea
            style={{ resize: "none", width: "100%", height: 400 }}
            className={styleUtils.whiteCardV2}
            placeholder={"Voit kirjoittaa viestisi tänne"}
            ref={inputRef}
          ></textarea>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <PrimaryButton
              onClick={sendMessage}
              style={{
                padding: "5px 20px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              Lähetä
            </PrimaryButton>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
