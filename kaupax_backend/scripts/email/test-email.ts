import Mailgun from "mailgun.js";
import formData from "form-data";
const mailgun = new Mailgun(formData);

const DOMAIN = "kaupax.app";

const mg = mailgun.client({
  key: process.env.MAILGUN_KEY,
  username: "api",
  url: "https://api.eu.mailgun.net",
});

mg.messages
  .create(DOMAIN, {
    from: "support@kaupax.app",
    to: "joon241197@gmail.com",
    subject: "",
    html: `
                        <html>
                        <head>
                          <style>
                            body {
                              font-family: Arial, sans-serif;
                              color: #333;
                              line-height: 1.6;
                            }
                            h3 {
                              font-size: 1.5em;
                              color: #4b8df8;
                            }
                            p {
                              font-size: 1.1em;
                              margin-bottom: 1.2em;
                            }
                            a {
                              color: #4b8df8;
                              text-decoration: none;
                            }
                            a:hover {
                              text-decoration: underline;
                            }
                          </style>
                        </head>
                        <body>
                          <h3>
                            Asunnollesi osoitteessa Karibianranta 4 B 55 etsitään nyt kiinteistönvälittäjää! 🏠
                          </h3>
                          <p>
                            Haluamme auttaa sinua löytämään parhaan mahdollisen välittäjän, joka
                            auttaa sinua myymään kotisi nopeasti ja helposti. 😊
                          </p>
                          <p>
                            Lähetämme sinulle säännöllisesti muistutuksia uusista tarjouksista ja voit
                            myös itse seurata kilpailutuksen tilannetta helposti ja kätevästi sivulta
                            <a href="https://www.kaupax.app">https://www.kaupax.app</a>. 📧
                          </p>
                      
                          <p>
                            Sieltä löydät kaikki tarjoukset, jotka ovat tulleet asunnostasi ja voit
                            vertailla niitä helposti keskenään. 📊
                          </p>
                          <p>
                            Tässä sinulle tunnukset, joilla pääset seuraamaan kilpailutuksen
                            tilannetta: 🔑
                          </p>
                          <p>
                            Sähköposti: joon241997@gmail.com <br />
                            Salasana: testisalasana123!
                          </p>
                      
                          <p>
                            Kirjaudu nyt sisään ja aloita kilpailutuksen seuraaminen. 🚀 Jos sinulla
                            on mitään kysyttävää, ole hyvä ja ota yhteyttä meihin. Olemme aina
                            valmiita auttamaan sinua parhaamme mukaan. 💪
                          </p>
                          <p>Ystävällisin terveisin, Tiimi Kaupax 😊</p>
                        </body>
                      </html>        
                          `,
  })
  .then((response) => {
    console.log("Email sent successfully:", response);
  })
  .catch((error) => {
    console.error("Error while sending email:", error);
  });
