import { useLayout } from "@/context/layout";
import { NAV_HEIGHT } from "@/utils/constants";
import { Box } from "@mui/material";

export function IntendedContent({ children }: { children?: React.ReactNode }) {
  const layoutProps = useLayout();

  return (
    <Box
      sx={{
        maxWidth: layoutProps.intendedContent,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
}

export default function ContentSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        marginTop: NAV_HEIGHT,
        padding: "16px",
      }}
    >
      <IntendedContent>{children}</IntendedContent>
    </Box>
  );
}
