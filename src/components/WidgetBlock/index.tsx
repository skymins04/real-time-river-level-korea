import { ReactNode } from "react";

import "./style.scss";

interface WidgetBlockProps {
  widgetId?: string;
  icon?: ReactNode | string;
  title?: ReactNode | string;
  rightArea?: ReactNode | string;
  children: ReactNode;
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
}

const WidgetBlock = ({
  widgetId,
  icon,
  title,
  children,
  flexDirection,
  rightArea,
}: WidgetBlockProps) => {
  return (
    <div className="widget-block" id={widgetId || ""}>
      {title && (
        <div className="widget-title">
          <div className="icon">{icon}</div>
          <div className="text">{title}</div>
          <div className="right-area">{rightArea}</div>
        </div>
      )}

      <div className="widget-content" style={{ flexDirection }}>
        {children}
      </div>
    </div>
  );
};

export default WidgetBlock;
