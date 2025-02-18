import React from "react";
import styles from "./CryptoMenu.module.css";
import { supportedCryptos } from "../../supportedCryptos";
import { useCryptoMenuState } from "../../hooks/useCryptoMenuState";

const formatter = Intl.NumberFormat("en", { notation: "compact" });

export default function CryptoMenu({
  marketData,
  selectedCryptos,
  toggleSelection,
}) {
  const {
    searchQuery,
    setSearchQuery,
    onlySelected,
    setOnlySelected,
    sortCriteria,
    setSortCriteria,
    maxCoins,
    setMaxCoins,
    sortedCryptos,
  } = useCryptoMenuState(supportedCryptos, marketData, selectedCryptos);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className={styles.sortButtons}>
          {[
            { label: "A", criteria: "alphabetical", tooltip: "Alphabetical" },
            { label: "P", criteria: "price", tooltip: "Price" },
            { label: "M", criteria: "marketCap", tooltip: "FDV Market Cap" },
            { label: "G", criteria: "gain", tooltip: "24h Gain" },
            { label: "L", criteria: "loss", tooltip: "24h Loss" },
          ].map(({ label, criteria, tooltip }) => (
            <div key={criteria} className={styles.tooltipWrapper}>
              <button
                className={`${styles.sortButton} ${
                  sortCriteria === criteria ? styles.activeSort : ""
                }`}
                onClick={() => setSortCriteria(criteria)}
              >
                {label}
              </button>
              <span className={styles.tooltip}>{tooltip}</span>
            </div>
          ))}
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
        <div className={styles.tooltipWrapper}>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="1"
              max={supportedCryptos.length}
              value={maxCoins}
              onChange={(e) => setMaxCoins(Number(e.target.value))}
              className={styles.slider}
            />
            <label>{maxCoins}</label>
            <span className={styles.tooltip}>Max coins shown</span>
          </div>
        </div>
      </div>

      <div className={styles.cryptoMenu}>
        {sortedCryptos.slice(0, maxCoins).map((crypto) => {
          const data = marketData[crypto.symbol] || {};
          let statValue = "";

          if (
            sortCriteria === "price" ||
            (sortCriteria === "alphabetical" && data)
          ) {
            statValue = `$${parseFloat(data.price || 0).toFixed(2)}`;
          } else if (
            (sortCriteria === "gain" || sortCriteria === "loss") &&
            data
          ) {
            statValue = `${parseFloat(data.priceChangePercent || 0).toFixed(
              2
            )}%`;
          } else if (sortCriteria === "marketCap" && data) {
            statValue = `$${formatter.format(
              parseFloat((crypto.supply || 0) * (data.price || 0))
            )}`;
          }

          const isNegative =
            (sortCriteria === "gain" || sortCriteria === "loss") &&
            data &&
            parseFloat(data.priceChangePercent) < 0;

          return (
            <div
              key={crypto.symbol}
              className={`${styles.menuItem} ${
                selectedCryptos.some((el) => el.symbol === crypto.symbol)
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
