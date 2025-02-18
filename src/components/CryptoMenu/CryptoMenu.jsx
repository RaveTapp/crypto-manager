import React, { useState, useEffect } from "react";
import styles from "./CryptoMenu.module.css";
import { supportedCryptos } from "../../supportedCryptos";

const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export default function CryptoMenu({
  marketData,
  selectedCryptos,
  toggleSelection,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlySelected, setOnlySelected] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("alphabetical");

  const filteredCryptos = supportedCryptos.filter((crypto) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      crypto.name.toLowerCase().includes(lowerQuery) ||
      crypto.acronym.toLowerCase().includes(lowerQuery);
    return onlySelected
      ? matchesSearch &&
          selectedCryptos.find((el) => el.symbol == crypto.symbol)
      : matchesSearch;
  });

  const sortedCryptos = filteredCryptos.slice().sort((a, b) => {
    const dataA = marketData[a.symbol] || {};
    const dataB = marketData[b.symbol] || {};
    switch (sortCriteria) {
      case "price":
        return parseFloat(dataB.price || 0) - parseFloat(dataA.price || 0);
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
          parseFloat(b.supply * dataB.price || 0) -
          parseFloat(a.supply * dataA.price || 0)
        );
      case "alphabetical":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.sortButtons}>
          <div className={styles.tooltipWrapper}>
            <button
              className={`${styles.sortButton} ${
                sortCriteria === "alphabetical" ? styles.activeSort : ""
              }`}
              onClick={() => setSortCriteria("alphabetical")}
            >
              A
            </button>
            <span className={styles.tooltip}>Alphabetical</span>
          </div>
          <div className={styles.tooltipWrapper}>
            <button
              className={`${styles.sortButton} ${
                sortCriteria === "price" ? styles.activeSort : ""
              }`}
              onClick={() => setSortCriteria("price")}
            >
              P
            </button>
            <span className={styles.tooltip}>Price</span>
          </div>
          <div className={styles.tooltipWrapper}>
            <button
              className={`${styles.sortButton} ${
                sortCriteria === "marketCap" ? styles.activeSort : ""
              }`}
              onClick={() => setSortCriteria("marketCap")}
            >
              M
            </button>
            <span className={styles.tooltip}>FDV Market Cap</span>
          </div>
          <div className={styles.tooltipWrapper}>
            <button
              className={`${styles.sortButton} ${
                sortCriteria === "gain" ? styles.activeSort : ""
              }`}
              onClick={() => setSortCriteria("gain")}
            >
              G
            </button>
            <span className={styles.tooltip}>24h Gain</span>
          </div>
          <div className={styles.tooltipWrapper}>
            <button
              className={`${styles.sortButton} ${
                sortCriteria === "loss" ? styles.activeSort : ""
              }`}
              onClick={() => setSortCriteria("loss")}
            >
              L
            </button>
            <span className={styles.tooltip}>24h Loss</span>
          </div>
        </div>
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
        {sortedCryptos.map((crypto) => {
          const data = marketData[crypto.symbol];
          let statValue = "";
          if (
            sortCriteria === "price" ||
            (sortCriteria === "alphabetical" && data)
          ) {
            statValue = `$${parseFloat(data.price).toFixed(2)}`;
          } else if (
            (sortCriteria === "gain" || sortCriteria === "loss") &&
            data
          ) {
            const pct = parseFloat(data.priceChangePercent).toFixed(2) + "%";
            statValue = pct;
          } else if (sortCriteria === "marketCap" && data) {
            statValue = `$${formatter.format(parseFloat(crypto.supply * data.price))}`;
          }
          const isNegative =
            (sortCriteria === "gain" || sortCriteria === "loss") &&
            data &&
            parseFloat(data.priceChangePercent) < 0;

          return (
            <div
              key={crypto.symbol}
              className={`${styles.menuItem} ${
                selectedCryptos.find((el) => el.symbol == crypto.symbol)
                  ? styles.selected
                  : ""
              }`}
              onClick={() => toggleSelection(crypto.symbol)}
            >
              <img
                src={crypto.logo}
                alt={crypto.name}
                className={styles.cryptoLogo}
              />
              <span>{crypto.name}</span>
              <div
                className={styles.cryptoStat}
                style={isNegative ? { color: "red" } : {}}
              >
                {statValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
