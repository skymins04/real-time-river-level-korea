/* eslint-disable react/display-name */
import { ReactNode, forwardRef } from "react";
import Draggable from "react-draggable";

interface CustomDraggableProps {
  children: ReactNode;
  isMobile: boolean;
}

const CustomDraggable = forwardRef(({ children, isMobile }: CustomDraggableProps, ref) => {
  if (isMobile) {
    return <>{children}</>;
  } else {
    return <Draggable ref={ref as any}>{children}</Draggable>;
  }
});

export default CustomDraggable;
