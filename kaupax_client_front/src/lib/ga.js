import ReactGA from "react-ga";

export const initGA = () => {
  ReactGA.initialize("G-T855EDT86R");
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
