import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import keycloak from "./services/keycloak.service";

keycloak
  .init({
    onLoad: "login-optional",
    checkLoginIframe: false,
    pkceMethod: "S256",
    enableLogging: true,
  })
  .then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  })
  .catch(() => {
    console.error("Keycloak initialization failed");
    // Still render the app even if Keycloak fails
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
    );
  });
