import Keycloak from "keycloak-js";

// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8180",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "taskflow",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "taskflow-frontend",
});

export default keycloak;
