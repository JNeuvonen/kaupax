import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { Box } from "@mui/material";

export default function ListingThankYou() {
  const auth = useAuth();

  if (!auth.accessToken) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }
  return <Box>Muokkaa nakyma</Box>;
}
