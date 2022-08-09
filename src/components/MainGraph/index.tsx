import WidgetBlock from "@Component/WidgetBlock";

const MainGraph = () => {
  return (
    <WidgetBlock
      icon={<div style={{ width: "10px", height: "10px", background: "red" }}></div>}
      title="전체 하천 수위 현황"
    >
      <h1>hello world</h1>
    </WidgetBlock>
  );
};

export default MainGraph;
