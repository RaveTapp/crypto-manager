import React from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import CryptoMenu from "../CryptoMenu/CryptoMenu";
import { useCryptoState } from "../../hooks/useCryptoState";
import { Menu } from "lucide-react";
import PortfolioSwitcher from "../PortfolioSwitcher/PortfolioSwitcher";

//localStorage.clear();

function Home() {
  const {
    cryptoMenuOpen,
    setCryptoMenuOpen,
    selectedCryptos,
    toggleSelection,
    holdings,
    handleHoldingsChange,
    prices,
    calculatedValues,
    totalValue,
  } = useCryptoState();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.menuButton} onClick={() => setCryptoMenuOpen(!cryptoMenuOpen)}>
          <Menu size={24} />
        </button>
        <PortfolioSwitcher />
        <h2>${totalValue.toFixed(2)}</h2>
      </div>

      <div className={styles.content}>
        {cryptoMenuOpen && (
          <CryptoMenu
            selectedCryptos={selectedCryptos}
            toggleSelection={toggleSelection}
          />
        )}
        <PriceList
          prices={prices}
          selectedCryptos={selectedCryptos}
          holdings={holdings}
          handleHoldingsChange={handleHoldingsChange}
          calculatedValues={calculatedValues}
        />
      </div>
    </div>
  );
}

export default Home;
