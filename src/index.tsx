import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom";

import { initI18n } from "@i18n";
import ResponsiveLayout from "./layouts/responsive.layout";
import MainPage from "@Component/MainPage";
import "./style.scss";

initI18n();

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <ResponsiveLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </ResponsiveLayout>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root"),
);
