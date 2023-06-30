import { RemoveIcon } from "@/utils/icons";
import { useState } from "react";

interface Props {
  url: string;
  alt: string;
  className: string;
  removeImageCallback: () => void;
}

export default function ImageCard({
  url,
  alt,
  className,
  removeImageCallback,
}: Props) {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <img
        src={url}
        alt={alt}
        className={className}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      />

      {mouseOver && (
        <div
          style={{
            position: "absolute",
            right: "-12px",
            top: "-12px",
            cursor: "pointer",
          }}
          onMouseEnter={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          onClick={removeImageCallback}
        >
          <RemoveIcon width={30} />
        </div>
      )}
    </div>
  );
}
