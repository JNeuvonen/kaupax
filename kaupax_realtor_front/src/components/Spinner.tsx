import { Box, CircularProgress } from "@mui/material";

export default function Spinner({
  fullScreen,
  size = 40,
}: {
  fullScreen?: boolean;
  size?: number;
}) {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}
