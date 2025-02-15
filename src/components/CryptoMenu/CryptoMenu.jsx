import React, { useState } from "react";
import styles from "./CryptoMenu.module.css";

export default function CryptoMenu({ supportedCryptos, selectedCryptos, toggleSelection }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCryptos = supportedCryptos.filter((crypto) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      crypto.name.toLowerCase().includes(lowerQuery) ||
      crypto.symbol.toLowerCase().includes(lowerQuery)
    );
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
      </div>
      <div className={styles.cryptoMenu}>
        {filteredCryptos.map((crypto) => (
          <div
            key={crypto.symbol}
            className={`${styles.menuItem} ${selectedCryptos.includes(crypto.symbol) ? styles.selected : ""
              }`}
            onClick={() => toggleSelection(crypto.symbol)}
          >
            <img src={crypto.logo} alt={crypto.name} className={styles.cryptoLogo} />
            <span>{crypto.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
