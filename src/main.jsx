import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./components/home/Home";
import styles from "./main.module.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className={styles.root}>
      <Home />
    </div>
  </React.StrictMode>
);
