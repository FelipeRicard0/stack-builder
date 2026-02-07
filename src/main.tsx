import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";
import ReactGA from "react-ga4";
import Analytics from "./Analytics.tsx";
import Clarity from "@microsoft/clarity";

ReactGA.initialize(import.meta.env.VITE_GA_ID);
Clarity.init(import.meta.env.VITE_CLARITY_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="dark" storageKey="stack-builder-theme">
        <BrowserRouter>
          <Analytics />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>,
);
