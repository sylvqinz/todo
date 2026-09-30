import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import * as Sentry from "@sentry/react";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

// On configure Sentry uniquement en production quand le DSN est disponible.
if (import.meta.env.PROD && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,

    integrations: [
      // Cette intégration active le monitoring de performance.
      // Elle permet de voir, par exemple, combien de temps prennent les appels API.
      Sentry.browserTracingIntegration(),

      // Cette intégration enregistre les sessions utilisateur où une erreur se produit.
      Sentry.replayIntegration(),
    ],

    // On configure le taux d'échantillonnage pour la performance.
    // 1.0 signifie qu'on capture 100% des transactions pour analyse.
    tracesSampleRate: 1.0,

    // On enregistre 10% des sessions et toutes les sessions comportant une erreur.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
