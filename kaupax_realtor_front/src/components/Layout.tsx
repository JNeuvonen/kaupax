import ContentContainer from "./ContentContainer";
import PageHeader from "./Nav/PageHeader";
import SideMenu from "./Nav/SideNav";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <PageHeader />
      <SideMenu />
      <ContentContainer>{children}</ContentContainer>
    </>
  );
}
