import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import i18n, { initI18n } from "@i18n";
import reduxStore from "@Redux";
import ResponsiveLayout from "@Layout/responsive.layout";
import MainPage from "@Component/MainPage";

import "./style.scss";

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
