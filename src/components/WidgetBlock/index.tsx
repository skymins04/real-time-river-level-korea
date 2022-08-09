import "./style.scss";

const WidgetBlock = ({ icon, title, children }: any) => {
  return (
    <div className="widget-block">
      <div className="widget-title">
        <div className="icon">{icon}</div>
        <div className="text">{title}</div>
      </div>
      <div className="widget-content">{children}</div>
    </div>
  );
};

export default WidgetBlock;
