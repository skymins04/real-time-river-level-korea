import { useState } from "react";

const useMouseMove = () => {
  const [state, setState] = useState({ x: 0, y: 0 });

  const handler = (e: any) => {
    e.persist();
    setState(state => ({ ...state, x: e.clientX, y: e.clientY }));
  };
  return {
    x: state.x,
    y: state.y,
    handler,
  };
};

export default useMouseMove;
