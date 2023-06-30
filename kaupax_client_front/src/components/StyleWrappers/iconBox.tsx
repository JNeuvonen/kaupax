import { Box } from "@mui/material";

export default function IconBox({
  columnGap = "10px",
  icon,
  children,
}: {
  columnGap: string;
  icon: JSX.Element;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", columnGap: columnGap, alignItems: "center" }}>
      {icon}
      {children}
    </Box>
  );
}
