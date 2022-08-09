import { PropsWithChildren } from "react";

const MobileLayout = (props: PropsWithChildren) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "1170px",
          margin: "auto",
          marginTop: "4rem",
          height: "100%",
        }}
      >
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default MobileLayout;
