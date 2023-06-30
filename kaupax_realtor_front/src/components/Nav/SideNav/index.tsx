import { useLayout } from "@/context/layout";
import {
  BLACK_100,
  BLACK_200,
  GREY_400,
  SIDE_MENU_BP,
  SIDE_MENU_FOCUS_WIDTH,
  SIDE_MENU_WIDTH,
  TEXT_GREY,
  WHITE_GREY,
} from "@/utils/constants";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { ChevronLeft, HamburgerIcon } from "@/utils/icons";
import { Box } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  closeSideMenu,
  navDisableFocusMode,
  navFocusMode,
  openSideMenu,
} from "./funcs";
import { BrandLogo, defaultMenuItems } from "./menuItems";

export default function SideMenu() {
  const { width } = useWindowDimensions();
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuItems] = useState(defaultMenuItems);
  const [ctaAction] = useState(BrandLogo());
  const [navOnFocusMode, setNavOnFocusMode] = useState(false);
  const setSideMenuWidth = useLayout().setSideMenuWidth;

  useEffect(() => {
    if (width < SIDE_MENU_BP) {
      setShowMenu(false);
      closeSideMenu(false);
      setSideMenuWidth("0px");
    } else {
      setShowMenu(true);
      openSideMenu(false);
      setSideMenuWidth(SIDE_MENU_WIDTH);
    }
  }, [width, setSideMenuWidth]);

  useEffect(() => {
    const blur = document.getElementById("blur") as HTMLElement;

    blur.addEventListener("click", () => {
      if (showMenu) {
        closeSideMenu(true);
        setTimeout(() => {
          setShowMenu(false);
        }, 450);
      }
    });
    setMounted(true);
  }, [showMenu]);

  const menuOnClick = () => {
    openSideMenu(true);
    setShowMenu(true);
    setNavOnFocusMode(false);
  };

  const linkIsActive = (href: string) => {
    if (href === "/kilpailutukset/kartta") {
      if (window.location.pathname.includes("/kilpailutukset")) {
        return true;
      } else {
        return false;
      }
    }
    return window.location.pathname === href;
  };

  const mobileMenuOpenBtn = () => {
    return (
      <Box
        sx={{
          position: "fixed",
          left: "36px",
          top: "24px",
          zIndex: "300",
          cursor: "pointer",
        }}
        onClick={menuOnClick}
      >
        <HamburgerIcon width={30} fill={WHITE_GREY} />
      </Box>
    );
  };

  const linkOnClick = () => {
    if (width < SIDE_MENU_BP) {
      closeSideMenu(true);
      setTimeout(() => {
        setShowMenu(false);
      }, 450);
    }
  };

  return (
    <>
      <BlurDiv />

      {!showMenu && mounted && mobileMenuOpenBtn()}

      <Box
        sx={{
          width: SIDE_MENU_WIDTH,
          height: "100vh",
          background: BLACK_200,
          position: "fixed",
          zIndex: 100,
          padding: navOnFocusMode ? "3px" : "12px",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          borderRight: "1px solid #14161c",
        }}
        id={"nav"}
      >
        {!navOnFocusMode && ctaAction}
        <Box
          sx={{
            marginTop: "46px",
            display: "flex",
            flexDirection: "column",
            rowGap: "24px",
          }}
        >
          {menuItems.map((item) => {
            const isActive = linkIsActive(item.href);

            return (
              <Link href={item.href} key={item.href} onClick={linkOnClick}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "12px",
                    color: TEXT_GREY,
                    opacity: isActive ? "1" : "0.9",
                    background: isActive ? BLACK_100 : "transparent",
                    padding: "6px",
                    borderRadius: "7px",
                    paddingLeft: navOnFocusMode ? "6px" : "12px",
                    paddingRight: navOnFocusMode ? "6px" : "12px",
                    marginLeft: "-12px",
                    width: "calc(100% + 24px)",
                  }}
                >
                  {item.icon(TEXT_GREY)}
                  {!navOnFocusMode && item.link}
                </Box>
              </Link>
            );
          })}
        </Box>

        <Box
          sx={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "50px",
            background: "#2f2f33",
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
            justifyContent: navOnFocusMode ? "center" : "",
            paddingRight: "6px",
            paddingLeft: "6px",
            borderTop: `1px solid ${BLACK_100}`,
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          <Box
            id={"nav-focus-mode-btn"}
            sx={{
              padding: "6px",
              background: GREY_400,
              width: "max-content",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              if (width < SIDE_MENU_BP) {
                closeSideMenu(true);
                setTimeout(() => {
                  setShowMenu(false);
                }, 450);
              } else {
                if (!navOnFocusMode) {
                  setNavOnFocusMode(true);
                  setSideMenuWidth(SIDE_MENU_FOCUS_WIDTH);
                  navFocusMode(width);
                } else {
                  setNavOnFocusMode(false);
                  navDisableFocusMode(width);

                  if (width < SIDE_MENU_BP) {
                    setSideMenuWidth("0px");
                  } else {
                    setSideMenuWidth(SIDE_MENU_WIDTH);
                  }
                }
              }
            }}
          >
            <ChevronLeft fill={"white"} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

const BlurDiv = () => {
  return (
    <Box
      id={"blur"}
      position={"fixed"}
      style={{
        position: "fixed",
        left: "0",
        right: "0",
        bottom: "0",
        top: "0",
        zIndex: "100",
        display: "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    />
  );
};
