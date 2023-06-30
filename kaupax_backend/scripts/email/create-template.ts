import AWS from "aws-sdk";
import * as dotenv from "dotenv";
import createListingTemplate from "../../src/aws/email/createListing";
dotenv.config();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const Pinpoint = new AWS.Pinpoint();
const main = async () => {
  const params = createListingTemplate({
    recipients: ["neuvonenjarno@gmail.com"],
    address: "Koskelantie 30, Helsinki, Finland",
    email: "neuvonenjarno@gmail.com",
    password: "testi123!",
  });
  Pinpoint.sendMessages(params)
    .promise()
    .then((data) => console.log(data.MessageResponse.Result))
    .catch(() => console.log("err"));
};

main();
