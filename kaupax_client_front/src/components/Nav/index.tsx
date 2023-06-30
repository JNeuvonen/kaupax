import { AuthContext, useAuth } from "@/context/auth";
import styles from "@/styles/nav.module.css";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { ChevronRight, MenuIcon } from "@/utils/icons";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IntendedContent } from "../ContentSection";
import { PrimaryButton } from "../MuiWrappers/Buttons/primary";
import { SecondaryButton } from "../MuiWrappers/Buttons/secondary";
import { MenuItems } from "./menuItems";

const LoginSectionMobile = ({
  auth,
  closeMenu,
}: {
  auth: AuthContext;
  closeMenu: () => void;
}) => {
  if (auth.isAuthenticated) {
    return (
      <Box
        sx={{
          marginTop: "15px",
          textAlign: "center",
          cursor: "pointer",
          fontWeight: "600",
          color: "#1D4ED8",
        }}
        onClick={() => {
          auth.logOff();
        }}
      >
        Kirjaudu ulos
      </Box>
    );
  }
  return (
    <Link href={"/login/kirjautuminen"} onClick={closeMenu}>
      <Box
        sx={{
          marginTop: "15px",
          textAlign: "center",
          cursor: "pointer",
          fontWeight: "600",
          color: "#1D4ED8",
        }}
      >
        Kirjaudu sisään
      </Box>
    </Link>
  );
};

const LoginSection = ({ auth }: { auth: AuthContext }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuItems] = React.useState(MenuItems);
  const open = Boolean(anchorEl);
  if (!auth.user) {
    return (
      <div
        style={{
          display: "flex",
          columnGap: "16px",
        }}
      >
        <Link href={"/ilmoitus"}>
          <PrimaryButton className={styles.loginButton}>
            Kilpailuta Kiinteistönvälittäjät
          </PrimaryButton>
        </Link>
        <Link href={"/login/kirjautuminen"}>
          <SecondaryButton className={styles.loginButton}>
            Kirjautuminen
          </SecondaryButton>
        </Link>
      </div>
    );
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button sx={{ padding: "0px", width: "0px" }} onClick={handleClick}>
        <div className={styles.navProfile} aria-haspopup="true">
          <div>Tili</div>
          <ChevronRight
            width={"15px"}
            style={{
              transform: "rotate(90deg)",
            }}
          />
        </div>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        className={styles.navMenu}
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: "10000000000000 !important",
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuItems.map((navItem) => {
          const { item, href } = navItem;
          let url = href;
          let link = item;

          if (item === "Ilmoitus") {
            if (auth.user && auth.user.Listing.length === 1) {
              url = `/ilmoitukset/${auth.user.Listing[0].uuid}/tiedot`;
              link = auth.user.Listing[0].addressFull.replace(", Finland", "");
            }

            if (auth.user && auth.user.Listing.length > 1) {
              link = "Ilmoitukset";
            }
          }

          if (item === "Tarjoukset") {
            if (auth.user && auth.user.Listing.length > 1) {
              return;
            }
            if (auth.user && auth.user.Listing.length === 1) {
              url = `/ilmoitukset/${auth.user.Listing[0].uuid}/tarjoukset`;
            }
          }
          return (
            <Link href={url} key={navItem.item}>
              <MenuItem
                onClick={handleClose}
                key={navItem.item}
                sx={{ fontSize: "22px" }}
              >
                {link}
              </MenuItem>
            </Link>
          );
        })}
        <Divider />
        {auth.user ? (
          <MenuItem
            onClick={() => {
              handleClose();
              auth.logOff();
            }}
            sx={{ fontSize: "22px" }}
          >
            Kirjaudu ulos
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

export default function NavBar() {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const blur = useRef<HTMLDivElement | null>(null);
  const mobileMenu = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuItems] = useState([
    { link: "Seuraa Kilpailutuksia", href: "/kilpailutukset/kartta" },
    { link: "Blogi", href: "/blogi" },
    { link: "Ota yhteyttä", href: "/ota-yhteytta" },
    { link: "Miksi kilpailuttaa välittäjät?", href: "/miksi" },
    { link: "Profiili", href: "/profiili" },
    { link: "Ilmoitus", href: "/ilmoitukset" },
    { link: "Tarjoukset", href: "/tarjoukset" },
    { link: "Uusi ilmoitus", href: "/ilmoitus" },
  ]);

  const closeMenu = () => {
    blur.current!.style.display = "none";
    mobileMenu.current!.style.top = "-500px";
  };

  useEffect(() => {
    if (width > 1000) {
      if (blur.current && mobileMenu.current) {
        blur.current.style.display = "none";
        mobileMenu.current.style.top = "-500px";
      }
    }
  }, [width]);

  useEffect(() => {
    blur.current?.addEventListener("click", () => {
      closeMenu();
    });
    setMounted(true);
  }, []);

  const renderLinks = () => {
    if (width < 1000) {
      return (
        <Box>
          <Box
            onClick={() => {
              if (mobileMenu.current && blur.current) {
                mobileMenu.current.style.top = "0px";
                blur.current.style.display = "flex";
              }
            }}
            sx={{
              cursor: "pointer",
            }}
          >
            <MenuIcon width={"25px"} />
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center", columnGap: "32px" }}>
        <Link href={"/kilpailutukset/kartta"}>
          <p className={styles.navItems}>Seuraa Kilpailutuksia</p>
        </Link>

        <Link href={"/blogi "}>
          <p className={styles.navItems}>Blogi</p>
        </Link>
        <Link href={"/ota-yhteytta"}>
          <p className={styles.navItems}>Ota yhteyttä</p>
        </Link>
        <Link href={"/ilmoitus"}>
          <p className={styles.navItems}>Miksi kilpailuttaa välittäjät?</p>
        </Link>

        <Box sx={{ position: "relative" }}>
          <LoginSection auth={auth} />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <div id={"blur"} className={styles.blur} ref={blur}></div>
      <Box className={styles.menuMobile} id={"mobile-nav"} ref={mobileMenu}>
        <Box className={styles.menuMobileContentContainer}>
          <Box
            sx={{ display: "flex", flexDirection: "column", rowGap: "16px" }}
          >
            {mobileMenuItems.map((navItem) => {
              const { link, href } = navItem;
              let url = href;
              let reformattedLink = link;

              if (link === "Ilmoitus") {
                if (auth.user && auth.user.Listing.length === 1) {
                  url = `/ilmoitukset/${auth.user.Listing[0].uuid}/tiedot`;
                }

                if (auth.user && auth.user.Listing.length > 1) {
                  reformattedLink = "Ilmoitukset";
                }
              }

              if (link === "Tarjoukset") {
                if (auth.user && auth.user.Listing.length > 1) {
                  return;
                }
                if (auth.user && auth.user.Listing.length === 1) {
                  url = `/ilmoitukset/${auth.user.Listing[0].uuid}/tarjoukset`;
                }
              }
              return (
                <div onClick={closeMenu} key={reformattedLink}>
                  <Link href={url}>
                    <p className={styles.navItems}>{reformattedLink}</p>
                  </Link>
                </div>
              );
            })}
          </Box>

          <Box>
            <Divider sx={{ width: "100vw" }} />

            {LoginSectionMobile({ auth: auth, closeMenu })}
          </Box>
        </Box>
      </Box>
      <Box className={styles.nav}>
        <IntendedContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 20,
              columnGap: "50px",
            }}
          >
            <Link
              href={"/"}
              style={{
                cursor: "pointer",
              }}
            >
              <h1 className={styles.navLogoText}>KAUPAX</h1>
            </Link>
            {mounted && renderLinks()}
          </Box>
        </IntendedContent>
      </Box>
      <Divider sx={{ width: "100vw", position: "fixed", top: 94 }} />
    </>
  );
}
