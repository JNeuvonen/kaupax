import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { MenuIcon } from "@/utils/icons";
import { useEffect, useRef, useState } from "react";
import styles from "./nav.module.css";
import { IconButton } from "@mui/material";
import { PrimaryButton } from "../MUI/Buttons/primaryButton";
import styleUtils from "@/styles/utils.module.css";
import Link from "next/link";
import { PRIMARY_BLUE_500 } from "@/utils/constants";
import { useAuth } from "@/context/auth";

export default function Nav() {
  const blur = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const mobileMenu = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const auth = useAuth();

  const closeMenu = () => {
    blur.current!.style.display = "none";
    mobileMenu.current!.style.top = "-500px";
  };

  const openMenu = () => {
    if (mobileMenu.current && blur.current) {
      mobileMenu.current.style.top = "0px";
      blur.current.style.display = "flex";
    }
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
    const blur = document.getElementById("blur") as HTMLElement;
    blur.addEventListener("click", () => {
      closeMenu();
    });
    setMounted(true);
  }, []);

  const renderRightCornerLinks = () => {
    if (width < 1000) {
      return (
        <IconButton onClick={openMenu}>
          <MenuIcon width={25} />
        </IconButton>
      );
    }

    return (
      <div>
        {auth.user ? (
          <PrimaryButton
            className={styleUtils.defaultButton}
            onClick={auth.logOff}
          >
            Kirjaudu ulos
          </PrimaryButton>
        ) : (
          <Link href={"/login/kirjautuminen"}>
            <PrimaryButton className={styleUtils.defaultButton}>
              Kirjautuminen
            </PrimaryButton>
          </Link>
        )}
      </div>
    );
  };

  const renderLinks = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <Link
            href={"/"}
            style={{
              cursor: "pointer",
            }}
          >
            <h1 className={styles.navLogoText}>KAUPAX</h1>
          </Link>
        </div>
        <div>{renderRightCornerLinks()}</div>
      </div>
    );
  };

  return (
    <>
      <div id={"blur"} className={styles.blur} ref={blur}></div>

      {mounted && (
        <>
          <div className={styles.menuMobile} id={"mobile-nav"} ref={mobileMenu}>
            <div className={styles.menuMobileContentContainer}>
              <Link
                href={"/login/kirjautuminen"}
                style={{
                  color: PRIMARY_BLUE_500,
                  fontWeight: 500,
                }}
              >
                Kirjautuminen
              </Link>
            </div>
          </div>
          <div className={styles.nav}>{renderLinks()}</div>
        </>
      )}
    </>
  );
}
