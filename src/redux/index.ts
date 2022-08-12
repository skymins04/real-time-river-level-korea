import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = (state: any, action: any) => {
  if (state === undefined) {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
      selectedCity: "seoul",
      selectedRegion: null,
    };
  }

  switch (action.type) {
    case "SELECT_CITY":
      return { ...state, selectedCity: action.selectedCity };
    case "SELECT_REGION":
      return { ...state, selectedRegion: action.selectedRegion };
  }

  return state;
};

const enhancer =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware())
    : composeWithDevTools(applyMiddleware(logger));

const reduxStore = createStore(rootReducer, enhancer);

export default reduxStore;
