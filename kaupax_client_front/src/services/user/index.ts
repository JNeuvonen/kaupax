import jwt from "jsonwebtoken";

export async function getTokenFromNodeBackend({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/access-token`,
    {
      method: "POST",
      body: JSON.stringify({
        payload: {
          email,
          name,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  return data.token;
}

export function generateJWTToken(email: string) {
  const token = jwt.sign(
    {
      email,
    },
    process.env.NEXTAUTH_SECRET as string,
    {
      expiresIn: "168h",
    }
  );

  return token;
}
