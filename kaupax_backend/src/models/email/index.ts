import Mailgun from "mailgun.js";
import formData from "form-data";
import * as dotenv from "dotenv";
dotenv.config();
const mailgun = new Mailgun(formData);

const DOMAIN = "kaupax.app";

const mg = mailgun.client({
  key: process.env.EMAIL_SERVICE_PRIVATE_KEY,
  username: "api",
  url: "https://api.eu.mailgun.net",
});

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = (params: SendEmailProps) => {
  mg.messages.create(DOMAIN, {
    from: "support@kaupax.app",
    ...params,
  });
};
