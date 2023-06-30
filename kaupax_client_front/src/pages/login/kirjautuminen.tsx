import ContentSection from "@/components/ContentSection";
import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import { SecondaryButton } from "@/components/MuiWrappers/Buttons/secondary";
import { useLayout } from "@/context/layout";
import styleUtils from "@/styles/utils.module.css";
import styles from "./kirjautuminen.module.css";
import React from "react";
import Link from "next/link";
export default function LoginPage() {
  const layout = useLayout();

  React.useEffect(() => {
    layout.setLayoutMaxWidth("1200px");
  }, [layout]);

  return (
    <ContentSection>
      <div
        className={styleUtils.whiteCardV2 + " " + styles.loginContainer}
        style={{ padding: "16px" }}
      >
        <div className={styles.contentContainer}>
          <h1 className={styleUtils.mainHeader + " " + styles.mainHeader}>
            Kirjaudu sisään
          </h1>

          <p
            style={{
              marginTop: "16px",
              maxWidth: "60%",
              textAlign: "center",
              margin: "0 auto",
            }}
          >
            Valitse oletko asunnon myyjä vai kiinteistönvälittäjä
          </p>

          <div className={styles.buttonsContainer}>
            <Link
              href={"/login/kirjaudu"}
              style={{
                width: "200px",
                margin: "0 auto",
              }}
            >
              <PrimaryButton
                style={{
                  fontSize: "18px",
                  textTransform: "capitalize",
                  width: "200px",
                  margin: "0 auto",
                }}
              >
                Asunnon myyjä
              </PrimaryButton>
            </Link>
            <Link
              href={"https://realtor-front.vercel.app/"}
              style={{
                width: "200px",
                margin: "0 auto",
              }}
            >
              <SecondaryButton
                style={{
                  fontSize: "18px",
                  textTransform: "capitalize",
                  width: "100%",
                }}
              >
                Kiinteistönvälittäjä
              </SecondaryButton>
            </Link>
          </div>

          <div
            style={{
              marginTop: "24px",
              wordWrap: "break-word",
              textAlign: "center",
            }}
          >
            <span>Eikö sinulla ole vielä tunnusta? </span>
            <Link href={"/login/luo-tili"} className={styleUtils.link}>
              Rekisteröi käyttäjä
            </Link>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}
