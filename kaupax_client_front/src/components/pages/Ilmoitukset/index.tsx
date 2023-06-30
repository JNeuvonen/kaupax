import ContentSection from "@/components/ContentSection";
import Spinner from "@/components/Spinner";
import { AuthContext } from "@/context/auth";
import { getListingsUrl } from "@/utils/endpoints";
import { useQueryKey } from "@/utils/tanstack/index";
import { ListingDetailed } from "@/utils/types/listing";
import { Box } from "@mui/material";
import Link from "next/link";

interface PageProps {
  auth: AuthContext;
}
export default function Ilmoitukset({ auth }: PageProps) {
  const usersListingsQuery = useQueryKey({
    key: "users-listings",
    url: getListingsUrl,
    accessToken: auth.accessToken as string,
  });

  if (!usersListingsQuery.data) {
    return <Spinner />;
  }

  const data = usersListingsQuery.data.res.payload as ListingDetailed[];

  return (
    <Box>
      <ContentSection>
        {data.map((item) => {
          return (
            <Link key={item.uuid} href={`/ilmoitukset/${item.uuid}/tarjoukset`}>
              <Box>{item.addressFull}</Box>
            </Link>
          );
        })}
      </ContentSection>
    </Box>
  );
}
