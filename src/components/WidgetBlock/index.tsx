import { ReactNode } from "react";

import "./style.scss";

interface WidgetBlockProps {
  icon: ReactNode | string;
  title: ReactNode | string;
  children: ReactNode;
}

const WidgetBlock = ({ icon, title, children }: WidgetBlockProps) => {
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
