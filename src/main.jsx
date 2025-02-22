import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./components/home/Home";
import styles from "./main.module.css";
import { CryptoProvider } from "./hooks/useCryptoState";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CryptoProvider>
      <div className={styles.root}>
        <Home />
      </div>
    </CryptoProvider>
  </React.StrictMode>
);
