import jwt from "jsonwebtoken";

export function decodeAccessToken({ token }: { token: string }) {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string
    );

    return decodedToken;
  } catch (err) {
    return null;
  }
}
