import { PrimaryButton } from "@/components/MuiWrappers/Buttons/primary";
import styles from "@/styles/thirdSection.module.css";
import { useRouter } from "next/router";

export default function ThirdSection() {
  const router = useRouter();
  const onClickHandler = () => {
    router.push("/ilmoitus");
  };
  return (
    <div className={styles.thirdSectionContainer}>
      <h3>
        Kun kilpailutat kiinteistönvälittäjän, sinulla on hyvä mahdollisuus
        saada parempi välittäjä edullisempaan hintaan.
      </h3>

      <PrimaryButton
        className={styles.cta}
        sx={{ padding: "18px 12px", fontSize: "16px", background: "#1D4ED8" }}
        onClick={onClickHandler}
      >
        Kilpailuta kiinteistönvälittäjät
      </PrimaryButton>
    </div>
  );
}
