import { useLayout } from "@/context/layout";
import styleUtils from "@/styles/utils.module.css";
import styles from "./ThankYou.module.css";
import { useEffect } from "react";
import { buildClassNames } from "@/utils/functions";

export default function ThankYouPage() {
  const setMaxWidth = useLayout().setLayoutMaxWidth;
  useEffect(() => {
    setMaxWidth("1300px");
  }, [setMaxWidth]);
  return (
    <div style={{ marginTop: "100px" }}>
      <h1
        className={buildClassNames([styleUtils.mainHeader, styles.mainHeader])}
      >
        Kiinteistönvälittäjien kilpailuttaminen on aloitettu.
      </h1>

      <p className={styleUtils.paragraph} style={{ marginTop: "10px" }}>
        Lähetimme sähköpostiisi kirjautumistiedot joilla pääset palveluun
        seuraamaan tarjouksia. Odota rauhassa, kun välittäjät kilpailevat
        tarjouksillaan. Kun tarjouksia on tullut tarpeeksi, saat sähköpostiisi
        linkin, josta pääset valitsemaan parhaan tarjouksen.
      </p>

      <h3 className={styleUtils.subHeader} style={{ marginTop: "40px" }}>
        Miksi kannattaa kilpailuttaa kiinteistönvälittäjät?
      </h3>
      <p className={styleUtils.paragraph}>
        Kilpailuttamalla kiinteistönvälittäjät voit säästää merkittävästi rahaa
        ja aikaa. Kun saat useita tarjouksia eri välittäjiltä, voit vertailla
        niitä ja valita edullisimman tai muuten sinulle sopivimman vaihtoehdon.
        Lisäksi kilpailuttaminen auttaa sinua löytämään luotettavan ja
        ammattitaitoisen kiinteistönvälittäjän, joka hoitaa asuntokaupan
        puolestasi parhaalla mahdollisella tavalla.
      </p>
    </div>
  );
}
