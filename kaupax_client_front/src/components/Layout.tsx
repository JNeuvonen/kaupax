import React from "react";
import GlobalCssPriority from "./MuiWrappers/MuiPriorityCss";
import NavBar from "./Nav";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <GlobalCssPriority>{children}</GlobalCssPriority>
    </>
  );
}
