import Nav from "@/components/PreLoggedIn/nav";
import styleUtils from "@/styles/utils.module.css";
import styles from "./waitingVerification.module.css";

export default function WaitingVerification() {
  return (
    <>
      <Nav />
      <div style={{ marginTop: "90px" }}>
        <div className={styles.contentContainer}>
          <h1 className={styleUtils.mainHeader} style={{ fontSize: "30px" }}>
            Kiitos ajastasi! Kun olemme vahvistaneet tilisi tiedot, olet valmis
            käyttämään palvelua.
          </h1>

          <p className={styleUtils.paragraph} style={{ marginTop: "15px" }}>
            Tietojen vahvistaminen tapahtuu yleensä nopeasti, mutta jos sinulla
            on kysyttävää, ota yhteyttä asiakaspalveluumme.
          </p>
        </div>
      </div>
    </>
  );
}
