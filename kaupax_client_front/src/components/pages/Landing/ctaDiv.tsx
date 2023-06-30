import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import styles from "@/styles/ctaDiv.module.css";
import {
  default as stylesCta,
  default as thirdSectionStyles,
} from "@/styles/thirdSection.module.css";
import { useRouter } from "next/router";

export default function CtaDiv() {
  const router = useRouter();

  const onClickHandler = () => {
    router.push("/ilmoitus");
  };

  return (
    <div className={thirdSectionStyles.thirdSectionContainer}>
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          rowGap: "0px",
        }}
      >
        <h3 className={styles.mainTitle}>Mietitkö asunnon myyntiä?</h3>

        <p className={styles.paragraph}>
          Täytä ilmainen lomake ja tavoitat alueesi kiinteistönvälittäjät
          hetkessä.
        </p>
        <PrimaryButton
          className={stylesCta.cta}
          onClick={onClickHandler}
          sx={{
            padding: "18px 12px",
            fontSize: "16px",
            background: "#1D4ED8",
            margin: "0 auto",
            marginTop: "24px",
          }}
        >
          Kilpailuta kiinteistönvälittäjät
        </PrimaryButton>
      </div>
    </div>
  );
}
