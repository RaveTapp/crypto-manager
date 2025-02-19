import React, { useState } from "react";
import styles from "./PriceList.module.css";
import CryptoModal from "../CryptoModal/CryptoModal";

export default function PriceList({
  marketData,
  selectedCryptos,
  holdings,
  handleHoldingsChange,
  calculatedValues,
}) {
  const [popupCrypto, setPopupCrypto] = useState(null);

  const handleBoxClick = (crypto) => {
    setPopupCrypto(crypto);
  };

  const closeModal = () => {
    setPopupCrypto(null);
  };

  return (
    <div>
      <ul className={styles.priceList}>
        {selectedCryptos.map((crypto) => {
          const amount = holdings[crypto.symbol] || 0;
          const value = calculatedValues[crypto.symbol] || 0;

          return (
            <li
              key={crypto.symbol}
              className={styles.priceListItem}
              onClick={() => handleBoxClick(crypto)}
            >
              <div className={styles.cryptoInfo}>
                <span>
                  {crypto.name} ({crypto.symbol}): $
                  {parseFloat(marketData[crypto.symbol]?.price) || ""}
                </span>
              </div>
              <div className={styles.holdingsControl}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHoldingsChange(
                      crypto.symbol,
                      Math.max(0, parseFloat(amount) - 1)
                    );
                  }}
                  className={styles.adjustButton}
                  disabled={amount <= 0}
                >
                  -
                </button>
                <input
                  type="number"
                  value={amount}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleHoldingsChange(crypto.symbol, e.target.value);
                  }}
                  className={styles.holdingsInput}
                  min="0"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHoldingsChange(crypto.symbol, parseFloat(amount) + 1);
                  }}
                  className={styles.adjustButton}
                >
                  +
                </button>
              </div>
              <div className={styles.cryptoValue}>
                Value: ${value.toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>
      {popupCrypto && (
        <CryptoModal crypto={popupCrypto} closeModal={closeModal} />
      )}
    </div>
  );
}
