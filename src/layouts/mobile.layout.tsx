import { PropsWithChildren } from "react";

import Header from "@Component/Header";
import Footer from "@Component/Footer";

const MobileLayout = (props: PropsWithChildren) => {
  return (
    <div style={{ width: "100%" }}>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          maxWidth: "1170px",
          padding: "var(--pd)",
          margin: "auto",
          marginTop: "1rem",
          height: "100%",
        }}
      >
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

export default MobileLayout;
