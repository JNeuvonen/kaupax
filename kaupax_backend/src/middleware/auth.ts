import { decodeAccessToken } from "../utils/functions/auth";

export function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message: "Access token is required",
    });
  }

  const decodedToken = decodeAccessToken({ token: authorization });

  if (decodedToken === null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { email, name } = decodedToken;

  if (!email) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.body.usersEmail = email;
  req.body.usersName = name;
  next();
}
