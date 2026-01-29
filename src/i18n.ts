import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pt from "./locales/pt.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import hi from "./locales/hi.json";
import ar from "./locales/ar.json";
import bn from "./locales/bn.json";
import fr from "./locales/fr.json";
import ru from "./locales/ru.json";
import ja from "./locales/ja.json";

i18n.use(initReactI18next).init({
  lng: navigator.language,
  fallbackLng: "en",
  resources: {
    pt: { translation: pt },
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
    hi: { translation: hi },
    ar: { translation: ar },
    bn: { translation: bn },
    fr: { translation: fr },
    ru: { translation: ru },
    ja: { translation: ja },
  },
});

export default i18n;
