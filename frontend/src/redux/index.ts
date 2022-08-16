import {
  combineReducers,
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "./reducer";

const rootReducer = combineReducers({ main: reducer });

const enhancer =
  process.env.NODE_ENV === "production"
    ? compose(applyMiddleware())
    : composeWithDevTools(applyMiddleware(logger));

const reduxStore = createStore(rootReducer, enhancer);

export default reduxStore;
