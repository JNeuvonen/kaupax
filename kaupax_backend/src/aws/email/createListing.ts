interface Props {
  recipients: string[];
  address: string;
  email: string;
  password: string;
}

export default function createListingTemplate({
  recipients,
  address,
  email,
  password,
}: Props) {
  const params = {
    ApplicationId: process.env.AWS_APPLICATION_ID,
    MessageRequest: {
      Addresses: {
        [recipients[0]]: {
          ChannelType: "EMAIL",
        },
      },
      MessageConfiguration: {
        EmailMessage: {
          FromAddress: "support@kaupax.app",
          SimpleEmail: {
            Subject: {
              Charset: "UTF-8",
              Data: `Asunnollesi osoitteessa ${address} etsitään nyt kiinteistönvälittäjää! 🏠`,
            },
            HtmlPart: {
              Data: `
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
                            Asunnollesi osoitteessa ${address.replace(
                              ", Finland",
                              ""
                            )} etsitään nyt kiinteistönvälittäjää! 🏠
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
                            Sähköposti: ${email}<br />
                            Salasana: ${password}
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
            },
          },
        },
      },
    },
  };

  return params;
}
