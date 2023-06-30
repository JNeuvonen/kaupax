import ContentSection from "@/components/ContentSection";
import ThankYouPage from "@/components/pages/CreateListing/ThankYou";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ListingPage() {
  const auth = useAuth();
  const router = useRouter();
  const { uuid } = router.query;

  useEffect(() => {
    if (auth.user && uuid) {
      router.push(`/ilmoitukset/${uuid}/tarjoukset`);
    }
  }, [auth, router, uuid]);

  return (
    <ContentSection>
      <ThankYouPage />
    </ContentSection>
  );
}
