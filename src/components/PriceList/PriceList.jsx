import React, { useState } from "react";
import styles from "./PriceList.module.css";
import CryptoModal from "../CryptoModal/CryptoModal";
import CryptoStat from "../CryptoModal/CryptoStat.jsx/CryptoStat";
import { useCryptoState } from "../../hooks/useCryptoState";

export default function PriceList() {
  const { marketData, selectedCryptos, holdings, calculatedValues, decimalLength } =
    useCryptoState();
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
          const price = parseFloat(marketData[crypto.symbol]?.price) || 0;
          const totalSpent = holdings[crypto.symbol].reduce(
            (sum, row) =>
              sum +
              (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
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
                  {crypto.name} ({crypto.symbol}): ${price || ""}
                </span>
              </div>

              <CryptoStat
                history={holdings[crypto.symbol]}
                decimalLength={decimalLength[crypto.symbol] || 2}
              />
              <div className={styles.cryptoValue}>
                Profit/Loss: ${value.toFixed(decimalLength)}
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
