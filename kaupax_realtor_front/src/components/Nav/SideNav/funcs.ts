import {
  SIDE_MENU_BP,
  SIDE_MENU_FOCUS_WIDTH,
  SIDE_MENU_WIDTH,
} from "@/utils/constants";

export const closeSideMenu = (byClick: boolean) => {
  const sidemenu: HTMLElement = document.getElementById("nav") as HTMLElement;
  const contentSection = document.getElementById(
    "content-section"
  ) as HTMLElement;
  const headerSection: HTMLElement = document.getElementById(
    "header"
  ) as HTMLElement;

  if (byClick) {
    sidemenu.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";
  } else {
    sidemenu.style.transition = "0s";

    if (contentSection) {
      contentSection.style.marginLeft = "0px";
    }

    if (headerSection) {
      headerSection.style.marginLeft = "0px";
      headerSection.style.width = "100%";
    }
  }
  sidemenu.style.width = "0px";
  sidemenu.style.padding = "0px";
  removeBlur();
};

export const openSideMenu = (byClick: boolean) => {
  const sidemenu = document.getElementById("nav") as HTMLElement;
  const contentSection = document.getElementById(
    "content-section"
  ) as HTMLElement;
  const header = document.getElementById("header") as HTMLElement;

  if (byClick) {
    sidemenu.style.transition = "0.42s cubic-bezier(0.42, 0, 0.58, 1)";
    rotateNavBtn("rotate(0deg)");
  } else {
    sidemenu.style.transition = "0s";

    if (contentSection) {
      contentSection.style.marginLeft = SIDE_MENU_WIDTH;
      header.style.marginLeft = SIDE_MENU_WIDTH;
      header.style.width = `calc(100% - ${SIDE_MENU_WIDTH})`;
    }
  }
  sidemenu.style.width = SIDE_MENU_WIDTH;
  sidemenu.style.padding = "24px";

  if (byClick) {
    blurScreen();
  }
};

const rotateNavBtn = (rotation: string) => {
  const focusBtn = document.getElementById("nav-focus-mode-btn") as HTMLElement;

  focusBtn.style.transform = rotation;
};

export const navFocusMode = (width: number) => {
  const nav = document.getElementById("nav") as HTMLElement;
  const contentSection = document.getElementById(
    "content-section"
  ) as HTMLElement;

  const headerSection: HTMLElement = document.getElementById(
    "header"
  ) as HTMLElement;

  nav.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";
  contentSection.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";
  headerSection.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";

  if (width > SIDE_MENU_BP) {
    contentSection.style.marginLeft = SIDE_MENU_FOCUS_WIDTH;
    headerSection.style.marginLeft = SIDE_MENU_FOCUS_WIDTH;
    headerSection.style.width = `calc(100% + ${SIDE_MENU_FOCUS_WIDTH})`;
  }
  nav.style.width = SIDE_MENU_FOCUS_WIDTH;
  rotateNavBtn("rotate(180deg)");
};

const blurScreen = () => {
  const blur = document.getElementById("blur") as HTMLElement;
  blur.style.display = "flex";
};

const removeBlur = () => {
  const blur = document.getElementById("blur") as HTMLElement;
  blur.style.display = "none";
};

export const navDisableFocusMode = (width: number) => {
  const nav = document.getElementById("nav") as HTMLElement;
  const contentSection = document.getElementById(
    "content-section"
  ) as HTMLElement;

  const headerSection: HTMLElement = document.getElementById(
    "header"
  ) as HTMLElement;
  nav.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";
  contentSection.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";
  headerSection.style.transition = "0.22s cubic-bezier(0.42, 0, 0.58, 1)";

  if (width > SIDE_MENU_BP) {
    contentSection.style.marginLeft = SIDE_MENU_WIDTH;
    headerSection.style.marginLeft = SIDE_MENU_WIDTH;
    headerSection.style.width = `calc(100% - ${SIDE_MENU_WIDTH})`;
  }
  nav.style.width = SIDE_MENU_WIDTH;
  rotateNavBtn("rotate(0deg)");
};
