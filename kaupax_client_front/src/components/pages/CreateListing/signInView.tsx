import { signIn } from "next-auth/react";

export default function SigninView() {
  return (
    <>
      <button onClick={() => signIn()}>Kirjaudu sisään jatkaaksesi</button>
    </>
  );
}
