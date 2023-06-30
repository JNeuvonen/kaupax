import Image from "next/image";

type Props = {
  width?: string;
  src: string;
};

export default function ResponsiveImage({ width = "500px", src }: Props) {
  return (
    <div
      style={{
        maxWidth: width,
        height: "max-content",
        width: "100%",
        position: "relative",
      }}
    >
      <Image
        src={src}
        priority
        alt={"image"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
