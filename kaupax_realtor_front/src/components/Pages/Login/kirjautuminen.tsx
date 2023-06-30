import ContentSection from "@/components/ContentSection";
import { useLayout } from "@/context/layout";
import styleUtils from "@/styles/utils.module.css";
import styles from "./kirjautuminen.module.css";
import React from "react";
import Link from "next/link";
import { PrimaryButton } from "@/components/MUI/Buttons/primaryButton";
import { SecondaryButton } from "@/components/MUI/Buttons/secondaryButton";
import Nav from "@/components/PreLoggedIn/nav";
export default function Kirjautuminen() {
  const layout = useLayout();

  React.useEffect(() => {
    layout.setIntendedContent(1200);
  }, [layout]);

  return (
    <>
      <Nav />
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
                    width: "100%",
                  }}
                >
                  Kiinteistönvälittäjä
                </PrimaryButton>
              </Link>
              <Link
                href={"https://placeholder-ashen.vercel.app/"}
                style={{
                  width: "200px",
                  margin: "0 auto",
                }}
              >
                <SecondaryButton
                  style={{
                    fontSize: "18px",
                    textTransform: "capitalize",
                    width: "200px",
                    margin: "0 auto",
                  }}
                >
                  Asunnon myyjä
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
    </>
  );
}
