import { useLayout } from "@/context/layout";
import { GREY_100, SIDE_MENU_BP, SIDE_MENU_WIDTH } from "@/utils/constants";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { Box } from "@mui/material";

export default function ContentContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const intendedContent = useLayout().intendedContent;
  const sideMenuWidth = useLayout().sideMenuWidth;

  return (
    <Box
      sx={{
        padding: width < SIDE_MENU_BP ? "16px" : "24px",
        paddingLeft:
          width < SIDE_MENU_BP ? "16px" : `${24 + intendedContent}px`,
        paddingRight:
          width < SIDE_MENU_BP ? "16px" : `${24 + intendedContent}px`,

        width: width < SIDE_MENU_BP ? "100%" : `calc(100% - ${sideMenuWidth})`,
        marginLeft: SIDE_MENU_WIDTH,
        minHeight: "100vh",
        position: "relative",
        background: GREY_100,
        paddingTop: "60px",
      }}
      id={"content-section"}
    >
      <Box
        sx={{
          background: GREY_100,
          width: "100%",
          minHeight: "85vh",
          height: "max-content",
          padding: "24px",
          borderRadius: "3px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
