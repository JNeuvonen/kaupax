import { AnalyticsIcon, LeadsIcon, SearchIcon } from "@/utils/icons";
import Link from "next/link";

export const defaultMenuItems = [
  {
    href: "/",
    link: "Dashboard",
    icon: (fill: string) => <AnalyticsIcon fill={fill} width={25} />,
  },
  {
    href: "/kilpailutukset/kartta",
    link: "Kilpailutukset",
    icon: (fill: string) => <SearchIcon fill={fill} width={25} />,
  },

  {
    href: "/voitetut-leadit",
    link: "Saadut Leadit",
    icon: (fill: string) => <LeadsIcon fill={fill} width={25} />,
  },
];

export const BrandLogo = () => {
  return (
    <Link href={"/"}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "white",
          columnGap: "16px",
          opacity: "1",
          fontFamily: "Georgia",
        }}
      >
        <span style={{ color: "#028bfb", fontSize: "30px" }}>KAUPAX</span>
      </div>
    </Link>
  );
};
