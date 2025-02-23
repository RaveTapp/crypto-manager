import React, { useState } from "react";
import styles from "./PriceList.module.css";
import CryptoModal from "../CryptoModal/CryptoModal";
import CryptoStat from "../CryptoModal/CryptoStat.jsx/CryptoStat";
import { useCryptoState } from "../../hooks/useCryptoState";
import { Edit } from "lucide-react";

export default function PriceList() {
  const {
    marketData,
    selectedCryptos,
    holdings,
    calculatedValues,
    decimalLength,
  } = useCryptoState();
  const [popupCrypto, setPopupCrypto] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleBoxClick = (crypto) => {
    setPopupCrypto(crypto);
  };

  const closeModal = () => {
    setEditMode(false);
    setPopupCrypto(null);
  };

  return (
    <div>
      <ul className={styles.priceList}>
        {selectedCryptos?.map((crypto) => {
          const price = parseFloat(marketData[crypto.symbol]?.price || 0);
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
              <button
                className={styles.iconButton}
                onClick={() => setEditMode(true)}
              >
                <Edit size={20} />
              </button>

              <CryptoStat
                history={holdings[crypto.symbol]}
                decimalLength={decimalLength[crypto.symbol] || 2}
                price={marketData[crypto.symbol]?.price}
                symbol={crypto.symbol}
              />
            </li>
          );
        })}
      </ul>
      {popupCrypto && (
        <CryptoModal
          crypto={popupCrypto}
          closeModal={closeModal}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
}
