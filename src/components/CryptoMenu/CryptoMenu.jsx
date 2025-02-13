import React from "react";
import styles from "./CryptoMenu.module.css";

export default function CryptoMenu({
  supportedCryptos,
  selectedCryptos,
  toggleSelection,
}) {
  return (
    <div className={styles.cryptoMenu}>
      {supportedCryptos.map((crypto) => (
        <div
          key={crypto.symbol}
          className={`${styles.menuItem} ${
            selectedCryptos.includes(crypto.symbol) ? styles.selected : ""
          }`}
          onClick={() => toggleSelection(crypto.symbol)}
        >
          <img
            src={crypto.logo}
            alt={crypto.name}
            className={styles.cryptoLogo}
          />
          <span>{crypto.name}</span>
        </div>
      ))}
    </div>
  );
}
