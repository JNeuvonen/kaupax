import { Button } from "@/components/MUI/Buttons/button";
import TextTooltip from "@/components/MUI/Tooltip/textTooltip";
import TextSecondary from "@/components/MUI/Typography/textSecondary";
import Spinner from "@/components/Spinner";
import { BLACK_300, BLUE_100, PURPLE_100, WHITE_TEXT } from "@/utils/constants";
import { formatPrices } from "@/utils/functions";
import { Apartment } from "@/utils/types/apartment";
import { Realtor } from "@/utils/types/realtor";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import DataGridWrapper from "./dataGrid";
interface Props {
  isFetching: boolean;
  apartment: Apartment;
  realtor: Realtor;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function OffersTable({
  isFetching,
  apartment,
  realtor,
  setDialogOpen,
}: Props) {
  if (isFetching) {
    return <Spinner />;
  }

  const renderRealtorsBids = () => {
    const realtorBid = getRealtorBid({ realtor, apartment });

    if (!realtorBid) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant={"h6"} color={WHITE_TEXT({ alpha: "0.9" })}>
              Tarjouksesi
            </Typography>
            <TextSecondary>
              Et ole vielä tehnyt tarjousta kohteeseen.
            </TextSecondary>
          </Box>

          <Button
            variant={"contained"}
            sx={{ width: "220px", height: "48px", fontSize: "17px" }}
            onClick={() => setDialogOpen(true)}
          >
            Tarjoa välitystä
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        <Box>
          <Typography variant={"h6"} color={WHITE_TEXT({ alpha: "0.9" })}>
            Tarjouksesi
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: "5px",
            display: "flex",
            columnGap: "48px",
            rowGap: "16px",
            marginTop: "16px",
            padding: "10px",
            backgroundColor: BLACK_300,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: "48px",
              flexWrap: "wrap",
              rowGap: "16px",
            }}
          >
            <Box>
              <Typography>Pyyntihinta</Typography>
              <TextSecondary
                props={{
                  fontSize: "18px",
                }}
              >
                {formatPrices(realtorBid.price)}
              </TextSecondary>
            </Box>

            <Box>
              <Typography>Välityspalkkio</Typography>
              <TextSecondary
                props={{
                  fontSize: "18px",
                }}
              >
                {formatPrices(realtorBid.comission)}€
              </TextSecondary>
            </Box>
            <Box>
              <Typography>Viesti</Typography>

              <TextTooltip
                str={realtorBid.message ? realtorBid.message : ""}
                strRender={realtorBid.message}
                tooltipTypographyStyles={{
                  fontSize: "18px",
                  color: BLUE_100,
                  opacity: "0.6",
                  textDecoration: "underline",
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              sx={{
                color: PURPLE_100,
                fontSize: "16px",
              }}
              onClick={() => setDialogOpen(true)}
            >
              Muokkaa
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {renderRealtorsBids()}

      <DataGridWrapper realtor={realtor} apartment={apartment} />
    </Box>
  );
}

export const getRealtorBid = ({
  realtor,
  apartment,
}: {
  realtor: Realtor;
  apartment: Apartment;
}) => {
  for (let i = 0; i < realtor.Bid.length; i++) {
    for (let j = 0; j < apartment.Bid.length; j++) {
      if (realtor.Bid[i].id === apartment.Bid[j].id) {
        return realtor.Bid[i];
      }
    }
  }
  return null;
};
