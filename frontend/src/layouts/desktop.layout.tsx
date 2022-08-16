import { PropsWithChildren } from "react";

import Header from "@Component/Header";
import Footer from "@Component/Footer";

const DesktopLayout = (props: PropsWithChildren) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "1170px",
          margin: "auto",
          height: "auto",
        }}
      >
        <div style={{ width: "100%", height: "100%", padding: "var(--pd)", marginTop: "1rem" }}>
          {props.children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DesktopLayout;
