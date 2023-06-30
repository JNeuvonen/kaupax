import bodyparser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import listing from "./routes/listing";
import user from "./routes/user";

dotenv.config();

const port = Number(process.env.PORT) || 3001;

const options = {
  ca: fs.readFileSync("ca_bundle.crt"),
  key: fs.readFileSync("private.key"),
  cert: fs.readFileSync("certificate.crt"),
};

const app = express();
app.use(bodyparser.json());
app.use(cors());

app.use("/user", user);
app.use("/listing", listing);

app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.get("/", (req, res) => {
  res.send("Pong");
});

https.createServer(options, app).listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
