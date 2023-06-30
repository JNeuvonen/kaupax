import { Tooltip } from "@mui/material";

interface Props {
  content: string;
  cutoffLength?: number;
}

export default function TypographyMaxLen({
  content,
  cutoffLength = 20,
}: Props) {
  if (content.length > cutoffLength) {
    return (
      <Tooltip title={content}>
        <span>{content.substring(0, cutoffLength)}...</span>
      </Tooltip>
    );
  }

  return <>{content}</>;
}
