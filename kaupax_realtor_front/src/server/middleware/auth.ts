import nextConnect from "next-connect";
import { decodeAccessToken } from "../utils";

const middleware = nextConnect();

middleware.use(async (req: any, res: any, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Access token is required",
    });
  }

  const decodedToken = decodeAccessToken({ token: authorization }) as any;

  if (decodedToken === null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { email } = decodedToken;

  if (!email) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
});

export default middleware;
