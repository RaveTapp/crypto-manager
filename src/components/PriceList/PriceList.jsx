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
          const amount = holdings[crypto.symbol] || 0;
          const value = calculatedValues[crypto.symbol] || 0;
          const decimalLength = parseFloat(marketData[crypto.symbol]?.price)
            ?.toString()
            .split(".")[1]?.length;
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
                Value: ${value.toFixed(2)}
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
