import React, { useState } from "react";
import styles from "./PriceList.module.css";
import CryptoModal from "../CryptoModal/CryptoModal";
import CryptoStat from "../CryptoModal/CryptoStat.jsx/CryptoStat";

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
          
          const decimalLength = parseFloat(marketData[crypto.symbol]?.price)
            ?.toString()
            .split(".")[1]?.length;
            const totalSpent = holdings[crypto.symbol].reduce(
              (sum, row) =>
                sum + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
              0
            );
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

              <CryptoStat
                history={holdings[crypto.symbol]}
                decimalLength={decimalLength}
              />
              <div className={styles.cryptoValue}>
                Profit/Loss: ${value.toFixed(decimalLength)}
              </div>
            </li>
          );
        })}
      </ul>
      {popupCrypto && (
        <CryptoModal
          crypto={popupCrypto}
          currentHolding={holdings[popupCrypto.symbol]}
          handleHoldingsChange={handleHoldingsChange}
          marketData={marketData}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
