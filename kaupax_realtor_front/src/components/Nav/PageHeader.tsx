import { Box } from "@mui/material";

export default function PageHeader() {
  return (
    <Box
      id={"header"}
      sx={{
        width: "100%",
        background: "#282B34",
        height: "70px",
        position: "fixed",
        top: 0,
        zIndex: 3,
        left: 0,
        borderBottom: 2,
        borderColor: "divider",
      }}
    ></Box>
  );
}
