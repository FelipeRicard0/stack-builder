import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Buildpage from "./pages/Builder";
import LandingPage from "./pages/LandingPage";
import i18n from "./i18n";
import { useEffect } from "react";

function LangLayout() {
  const { lang } = useParams();

  const supported = [
    "ar",
    "bn",
    "en",
    "es",
    "fr",
    "hi",
    "ja",
    "pt",
    "ru",
    "zh",
  ];
  const validLang = supported.includes(String(lang)) ? lang : "en";

  useEffect(() => {
    i18n.changeLanguage(validLang);
  }, [validLang]);

  if (lang !== validLang) {
    return <Navigate to={`/${validLang}`} replace />;
  }

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="builder" element={<Buildpage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={navigator.language.split("-")[0]} replace />}
      />
      <Route path="/:lang/*" element={<LangLayout />} />
    </Routes>
  );
}
