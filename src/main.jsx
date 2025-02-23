import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./components/home/Home";
import styles from "./main.module.css";
import { CryptoProvider } from "./hooks/useCryptoState";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CryptoProvider>
      <ErrorBoundary>
        <div className={styles.root}>
          <Home />
        </div>
      </ErrorBoundary>
    </CryptoProvider>
  </React.StrictMode>
);
