import { BORDER_SUBTLE, GREY_200 } from "@/utils/constants";
import { Apartment } from "@/utils/types/apartment";
import { Box, Typography } from "@mui/material";

export default function DetailsTab({ apartment }: { apartment: Apartment }) {
  return (
    <Box
      sx={{
        padding: "24px",
        border: `2px solid ${BORDER_SUBTLE}`,
        borderRadius: "5px",
        color: "rgba(210, 210, 210, 0.9)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
        <Box sx={{ marginTop: "0px" }}>
          <Typography variant={"body2"} color="rgba(210, 210, 210, 0.6)">
            Osoite
          </Typography>
          <Typography color={"rgba(245, 245, 245, 0.75)"}>
            {apartment.addressFull}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <Typography variant={"body2"} color="rgba(210, 210, 210, 0.6)">
            Rakennuksen tyyppi
          </Typography>
          <Typography color={"rgba(245, 245, 245, 0.75)"}>
            {apartment.listingType}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <Typography variant={"body2"} color="rgba(210, 210, 210, 0.6)">
            Neliöt
          </Typography>
          <Typography color={"rgba(245, 245, 245, 0.75)"}>
            {apartment.surfaceArea}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <Typography variant={"body2"} color="rgba(210, 210, 210, 0.6)">
            Kunto-arvio
          </Typography>
          <Typography color={"rgba(245, 245, 245, 0.75)"}>
            {apartment.condition}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <Typography variant={"body2"} color="rgba(210, 210, 210, 0.6)">
            Toivottu myyntihinta
          </Typography>
          <Typography color={"rgba(245, 245, 245, 0.75)"}>
            {apartment.usersEstimateOfPrice
              ? apartment.usersEstimateOfPrice / 1000 + "k"
              : "-"}
          </Typography>
        </Box>

        <Box sx={{ marginTop: "16px" }}>
          <Typography variant={"body2"} color="rgba(210, 210, 210, 0.6)">
            Tavoite
          </Typography>
          <Typography color={"rgba(245, 245, 245, 0.75)"}>
            {apartment.objective ? apartment.objective : "Ei ilmoitettu"}
          </Typography>
        </Box>

        {apartment.freeDescription && (
          <Box sx={{ marginTop: "16px" }}>
            <Typography color={"rgba(245, 245, 245, 0.6)"} variant={"body2"}>
              Käyttäjän vapaa kuvaus
            </Typography>

            <Box
              sx={{
                padding: "16px",
                background: GREY_200,
                borderRadius: "10px",
                marginTop: "5px",
              }}
            >
              <Typography
                color={"rgba(245, 245, 245, 0.7)"}
                variant={"body2"}
                sx={{ wordWrap: "break-word" }}
              >
                {apartment.freeDescription
                  ? apartment.freeDescription
                  : "Ei ilmoitettu"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
