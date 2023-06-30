import KilpailutuksetWrapper from "@/components/Pages/Kilpailutukset";
import { useAuth } from "@/context/auth";

export default function Kilpailutukset() {
  const accessToken = useAuth().accessToken;
  return (
    <div>
      <KilpailutuksetWrapper accessToken={accessToken as string} />
    </div>
  );
}
