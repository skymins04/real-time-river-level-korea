import { legacy_createStore as createStore } from "redux";

const reduxStore = createStore((state, action: any) => {
  if (state === undefined) {
    return {
      selectedCity: "seoul",
    };
  }

  switch (action.type) {
    case "SELECT_CITY":
      return { ...state, selectedCity: action.selectedCity };
  }

  return state;
}, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export default reduxStore;
