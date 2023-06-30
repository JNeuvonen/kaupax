import nextConnect from "next-connect";
import middleware from "../../server/middleware/auth";

//MIDDLEWARE TEST

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  res.send({ message: "Hello World" });
});

export default handler;
