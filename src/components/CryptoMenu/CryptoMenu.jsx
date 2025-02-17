import React, { useState, useEffect } from "react";
import styles from "./CryptoMenu.module.css";
import { supportedCryptos } from "../../supportedCryptos";

export default function CryptoMenu({ selectedCryptos, toggleSelection }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlySelected, setOnlySelected] = useState(false);
  const [marketData, setMarketData] = useState({});
  const [sortCriteria, setSortCriteria] = useState("price");

  useEffect(() => {
    async function fetchAllMarketData() {
      const promises = supportedCryptos.map((crypto) =>
        fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${crypto.symbol}`
        )
          .then((res) => res.json())
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      const dataMap = {};
      supportedCryptos.forEach((crypto, index) => {
        dataMap[crypto.symbol] = results[index];
      });
      setMarketData(dataMap);
    }
    fetchAllMarketData();
  }, []);

  const filteredCryptos = supportedCryptos.filter((crypto) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      crypto.name.toLowerCase().includes(lowerQuery) ||
      crypto.acronym.toLowerCase().includes(lowerQuery);
    return onlySelected
      ? matchesSearch && selectedCryptos.includes(crypto.symbol)
      : matchesSearch;
  });

  const sortedCryptos = filteredCryptos.slice().sort((a, b) => {
    const dataA = marketData[a.symbol] || {};
    const dataB = marketData[b.symbol] || {};
    switch (sortCriteria) {
      case "price":
        return (
          parseFloat(dataB.lastPrice || 0) - parseFloat(dataA.lastPrice || 0)
        );
      case "gain":
        return (
          parseFloat(dataB.priceChangePercent || 0) -
          parseFloat(dataA.priceChangePercent || 0)
        );
      case "loss":
        return (
          parseFloat(dataA.priceChangePercent || 0) -
          parseFloat(dataB.priceChangePercent || 0)
        );
      case "marketCap":
        return (
          parseFloat(dataB.quoteVolume || 0) -
          parseFloat(dataA.quoteVolume || 0)
        );
      default:
        return 0;
    }
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.sortButtons}>
          <button
            className={`${styles.sortButton} ${
              sortCriteria === "price" ? styles.activeSort : ""
            }`}
            onClick={() => setSortCriteria("price")}
          >
            P
          </button>
          <button
            className={`${styles.sortButton} ${
              sortCriteria === "gain" ? styles.activeSort : ""
            }`}
            onClick={() => setSortCriteria("gain")}
          >
            G
          </button>
          <button
            className={`${styles.sortButton} ${
              sortCriteria === "loss" ? styles.activeSort : ""
            }`}
            onClick={() => setSortCriteria("loss")}
          >
            L
          </button>
          <button
            className={`${styles.sortButton} ${
              sortCriteria === "marketCap" ? styles.activeSort : ""
            }`}
            onClick={() => setSortCriteria("marketCap")}
          >
            M
          </button>
        </div>
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
      </div>
      <div className={styles.cryptoMenu}>
        {sortedCryptos.map((crypto) => (
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
            <div className={styles.cryptoStat}>
              {sortCriteria === "price" &&
                (marketData[crypto.symbol]
                  ? `$${parseFloat(marketData[crypto.symbol].lastPrice).toFixed(
                      2
                    )}`
                  : "N/A")}
              {sortCriteria === "gain" &&
                (marketData[crypto.symbol]
                  ? `${parseFloat(
                      marketData[crypto.symbol].priceChangePercent
                    ).toFixed(2)}%`
                  : "N/A")}
              {sortCriteria === "loss" &&
                (marketData[crypto.symbol]
                  ? `${parseFloat(
                      marketData[crypto.symbol].priceChangePercent
                    ).toFixed(2)}%`
                  : "N/A")}
              {sortCriteria === "marketCap" &&
                (marketData[crypto.symbol]
                  ? `$${parseFloat(
                      marketData[crypto.symbol].quoteVolume
                    ).toFixed(2)}`
                  : "N/A")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
