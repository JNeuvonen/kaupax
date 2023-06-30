import { WHITE_CARD_HOVER } from "@/utils/constants";
import { Box } from "@mui/material";

export default function WhiteCard({
  active = false,
  children,
  onClickCallback,
  width = "200px",
  height = "200px",
  className,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClickCallback?: (item: string) => void;
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <Box
      onClick={() => onClickCallback && onClickCallback("")}
      className={className}
      sx={{
        border: "3px solid #D9D9D9",
        width: width,
        borderRadius: "10px",
        display: "flex",
        height: height,
        alignItems: "center",
        justifyContent: "center",
        background: active ? WHITE_CARD_HOVER : "white",
        flexDirection: "column",
        padding: "16px",
        textAlign: "center",
        rowGap: "5px",
        cursor: "pointer",
        "&:hover": {
          background: WHITE_CARD_HOVER,
        },
      }}
    >
      {children}
    </Box>
  );
}
