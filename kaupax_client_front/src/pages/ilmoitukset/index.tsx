import Ilmoitukset from "@/components/pages/Ilmoitukset";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";

export default function IlmoituksetPage() {
  const auth = useAuth();

  if (!auth.accessToken) {
    return <Spinner />;
  }

  return (
    <div>
      <Ilmoitukset auth={auth} />
    </div>
  );
}
