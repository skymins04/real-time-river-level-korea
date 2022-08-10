import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./locales/ko";
import en from "./locales/en";

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      en,
      ko,
    },
    lng: "ko",
    fallbackLng: "ko",
    ns: ["header", "footer", "article", "region"],
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
