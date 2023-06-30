import styleUtils from "@/styles/utils.module.css";

export const QA_ITEMS = [
  {
    title: "Onko Kaupax ilmainen?",
    content: (
      <p className={styleUtils.paragraph}>
        1. Kaupax on ilmainen palvelu kiinteistönvälittäjien kilpailuttamiseen /
        löytämiseen.
      </p>
    ),
  },
  {
    title: "Miten tiedän mikä on hyvä kiinteistönvälittäjä?",
    content: (
      <>
        <p className={styleUtils.paragraph}>
          1. Vertaa tarjouksia: Hyödynnä alustan tarjoamaa mahdollisuutta
          vertailla eri välittäjien tarjouksia, palveluita ja palkkioita. Näin
          voit löytää parhaan vastineen rahallesi.
        </p>
        <p className={styleUtils.paragraph}>
          2. Välittäjän profiili ja kokemus: Alustan kautta voit tarkastella
          välittäjien profiileja, joista näet heidän kokemuksensa, koulutuksensa
          ja erikoisosaamisensa. Valitse välittäjä, jolla on vahva
          paikallistuntemus ja hyvä maine alueella.
        </p>
        <p className={styleUtils.paragraph}>
          3. Henkilökohtainen yhteensopivuus: Lopulta valitse välittäjä, jonka
          kanssa tunnet olosi mukavaksi ja luotettavaksi. Tämä on tärkeää, sillä
          välittäjän kanssa teet yhteistyötä koko asuntokaupan ajan
        </p>
      </>
    ),
  },
];
