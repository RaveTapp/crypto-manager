import React, { useState } from "react";
import styles from "./CryptoMenu.module.css";
import { supportedCryptos } from "../../supportedCryptos";

export default function CryptoMenu({ selectedCryptos, toggleSelection }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlySelected, setOnlySelected] = useState(false);

  const filteredCryptos = supportedCryptos.filter((crypto) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      crypto.name.toLowerCase().includes(lowerQuery) ||
      crypto.acronym.toLowerCase().includes(lowerQuery);
    return onlySelected
      ? matchesSearch && selectedCryptos.includes(crypto.symbol)
      : matchesSearch;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search cryptos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={onlySelected}
            onChange={(e) => setOnlySelected(e.target.checked)}
          />
          <span>Only Selected</span>
        </label>
      </div>
      <div className={styles.cryptoMenu}>
        {filteredCryptos.map((crypto) => (
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
    </div>
  );
}
