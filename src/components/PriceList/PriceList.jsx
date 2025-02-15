import React from "react";
import styles from "./PriceList.module.css";

export default function PriceList({
  supportedCryptos,
  prices,
  selectedCryptos,
  holdings,
  handleHoldingsChange,
  calculatedValues,
}) {
  return (
    <div>
      <ul className={styles.priceList}>
        {supportedCryptos
          .filter((crypto) => selectedCryptos.includes(crypto.symbol))
          .map((crypto) => {
            const amount = holdings[crypto.symbol] || 0;
            const value = calculatedValues[crypto.symbol] || 0;

            return (
              <li key={crypto.symbol} className={styles.priceListItem}>
                <div className={styles.cryptoInfo}>
                  <span>
                    {crypto.name} ({crypto.symbol}): $
                    {prices[crypto.symbol]?.toFixed(2) || "N/A"}
                  </span>
                </div>
                <div className={styles.holdingsControl}>
                  <button
                    type="button"
                    onClick={() =>
                      handleHoldingsChange(
                        crypto.symbol,
                        parseFloat(amount) - 1
                      )
                    }
                    className={styles.adjustButton}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      handleHoldingsChange(crypto.symbol, e.target.value)
                    }
                    className={styles.holdingsInput}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleHoldingsChange(
                        crypto.symbol,
                        parseFloat(amount) + 1
                      )
                    }
                    className={styles.adjustButton}
                  >
                    +
                  </button>
                </div>
                <div className={styles.cryptoValue}>
                  Portfolio Value: ${value.toFixed(2)}
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
