import KilpailutuksetWrapper from "@/components/Pages/Kilpailutukset";
import { useAuth } from "@/context/auth";

export default function Kilpailutukset() {
  const auth = useAuth();

  return (
    <div>
      <KilpailutuksetWrapper accessToken={auth.accessToken as string} />
    </div>
  );
}
