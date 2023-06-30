import jwt from "jsonwebtoken";

export function buildAccessToken({ payload }: { payload: { email: string } }) {
  const token = jwt.sign(
    {
      email: payload.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "168h",
    }
  );

  return token;
}

export function decodeAccessToken({ token }: { token: string }) {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    return decodedToken;
  } catch (err) {
    return null;
  }
}

export function generateRandomPassword(length: number) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
