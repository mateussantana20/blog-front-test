import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async"; // <--- 1. IMPORTAR

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      {" "}
      {/* <--- 2. ENVOLVER O APP AQUI */}
      <App />
    </HelmetProvider>
  </StrictMode>,
);
