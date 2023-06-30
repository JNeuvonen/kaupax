import ContentSection from "@/components/ContentSection";
import styles from "@/styles/secondSection.module.css";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import styleUtils from "@/styles/utils.module.css";

interface InfoCard {
  header: string;
  content: string;
  reverse: boolean;
}
const InfoCard = ({ header, content, reverse }: InfoCard) => {
  return (
    <div className={reverse ? styles.infoCardReverse : styles.infoCard}>
      <div>
        <h1 className={styleUtils.mainHeader} style={{ fontSize: "28px" }}>
          {header}
        </h1>
        <div
          className={styleUtils.paragraph}
          style={{ fontSize: "23px", marginTop: "5px" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

interface InfoItem {
  header: string;
  content: string;
  icon: JSX.Element;
  reverse: boolean;
}

const InfoItem = ({ header, content, icon, reverse }: InfoItem) => {
  const { width } = useWindowDimensions();

  if (width < 1200) {
    return (
      <Box className={styles.infoItem}>
        <InfoCard header={header} content={content} reverse={reverse} />
        <div className={styles.infoCardIcon}>{icon}</div>
      </Box>
    );
  }
  return (
    <Box className={styles.infoItem}>
      {reverse ? (
        <InfoCard header={header} content={content} reverse={reverse} />
      ) : (
        <div className={styles.infoCardIcon}>{icon}</div>
      )}

      {reverse ? (
        <div className={styles.infoCardIcon}>{icon}</div>
      ) : (
        <InfoCard header={header} content={content} reverse={reverse} />
      )}
    </Box>
  );
};

export default function SecondSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.secondSectionContainer}>
      <ContentSection>
        <div className={styles.contentContainer}>
          <InfoItem
            header={"1. Kerro asuntosi tiedot"}
            content={
              "Pääset täyttämään asuntosi perustiedot. Tässä menee vain muutama minuutti."
            }
            reverse={true}
            icon={
              <img
                width={0}
                height={0}
                sizes={"100vw"}
                src={"/realtors.png"}
                className={styles.image}
                alt={"test"}
              />
            }
          />
          <InfoItem
            header={"2. Vastaanota tarjouksia"}
            content={
              "Voit vastaanottaa alustalla tarjouksia jopa kymmeniltä alueesi kiinteistönvälittäjiltä. Tarjouksissa näet heidän välityspalkkionsa ja arvion pyyntihinnasta, jotta voit vertailla eri vaihtoehtoja helposti"
            }
            reverse={false}
            icon={
              <img
                width={0}
                height={0}
                sizes={"100vw"}
                src={"/realtors.png"}
                className={styles.image}
                alt={"test"}
              />
            }
          />
          <InfoItem
            header={"3. Valitse paras tarjous"}
            content={
              "Valitse paras tai parhaat tarjoukset ja anna kiinteistönvälittäjän ottaa sinuun yhteyttä. Et ole sitounut tekemään toimeksiantoa, vaan voit yhä jatkaa neuvottelua välittäjän kanssa."
            }
            reverse={true}
            icon={
              <img
                width={0}
                height={0}
                sizes={"100vw"}
                src={"/success-realtor.png"}
                className={styles.image}
                alt={"test"}
              />
            }
          />
        </div>
      </ContentSection>
    </div>
  );
}
