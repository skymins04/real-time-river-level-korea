import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom";

import i18n, { initI18n } from "@i18n";
import reduxStore from "@Redux";
import ResponsiveLayout from "./layouts/responsive.layout";
import MainPage from "@Component/MainPage";
import "./style.scss";
import { Provider } from "react-redux";

initI18n();
const langHeader = i18n.getDataByLanguage("ko");
if (langHeader) {
  document.title = langHeader["header"]["HEADER_TITLE"];
}

ReactDOM.render(
  <Provider store={reduxStore}>
    <StrictMode>
      <BrowserRouter>
        <ResponsiveLayout>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </ResponsiveLayout>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
  document.getElementById("root"),
);
