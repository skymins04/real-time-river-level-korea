import { ReactNode } from "react";

import "./style.scss";

interface WidgetBlockProps {
  widgetId?: string;
  icon?: ReactNode | string;
  title?: ReactNode | string;
  children: ReactNode;
}

const WidgetBlock = ({ widgetId, icon, title, children }: WidgetBlockProps) => {
  return (
    <div className="widget-block" id={widgetId || ""}>
      {title && (
        <div className="widget-title">
          <div className="icon">{icon}</div>
          <div className="text">{title}</div>
        </div>
      )}

      <div className="widget-content">{children}</div>
    </div>
  );
};

export default WidgetBlock;
