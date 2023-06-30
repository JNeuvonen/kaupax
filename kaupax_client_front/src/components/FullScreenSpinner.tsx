import ContentSection from "./ContentSection";
import Spinner from "./Spinner";

export default function FullScreenSpinner() {
  return (
    <ContentSection>
      <div
        style={{
          display: "flex",
          height: "80vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    </ContentSection>
  );
}
