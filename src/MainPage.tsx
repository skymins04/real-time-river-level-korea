import WidgetBlock from "@Component/WidgetBlock";
import MainGraph from "@Component/MainGraph";

const MainPage = () => {
  return (
    <>
      <MainGraph />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          gap: "var(--pd)",
          marginTop: "var(--pd)",
        }}
      >
        <WidgetBlock icon={"hello"} title={"world"}>
          <h1>hello world</h1>
        </WidgetBlock>
        <WidgetBlock icon={"hello"} title={"world"}>
          <h1>hello world</h1>
        </WidgetBlock>
      </div>
    </>
  );
};

export default MainPage;
