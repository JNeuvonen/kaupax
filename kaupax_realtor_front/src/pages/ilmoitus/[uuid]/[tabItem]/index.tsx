import IlmoitusWrapper from "@/components/Pages/Ilmoitus";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { Realtor } from "@/utils/types/realtor";

export default function Ilmoitus() {
  const auth = useAuth();

  if (!auth.accessToken) {
    return <Spinner />;
  }

  return (
    <IlmoitusWrapper
      accessToken={auth.accessToken}
      user={auth.user as Realtor}
    />
  );
}
