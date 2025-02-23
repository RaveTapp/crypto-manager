import React from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import CryptoMenu from "../CryptoMenu/CryptoMenu";
import { useCryptoState } from "../../hooks/useCryptoState";
import { Plus } from "lucide-react";
import PortfolioSwitcher from "../PortfolioSwitcher/PortfolioSwitcher";
import { CryptoMenuProvider } from "../../hooks/useCryptoMenuState";

//localStorage.clear();

function Home() {
  const {
    cryptoMenuOpen,
    setCryptoMenuOpen,
    totalValue,
    marketData,
    selectedCryptos,
  } = useCryptoState();

  return (
    <CryptoMenuProvider
      marketData={marketData}
      selectedCryptos={selectedCryptos}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <PortfolioSwitcher />
          <h2>${totalValue?.toFixed(2)}</h2>
        </div>

        <div className={styles.content}>
          {cryptoMenuOpen && <CryptoMenu />}
          <PriceList />
          <div className={styles.menuBtnContainer}>
            <button
              className={styles.menuButton}
              onClick={() => setCryptoMenuOpen((prev) => !prev)}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>
    </CryptoMenuProvider>
  );
}

export default Home;
