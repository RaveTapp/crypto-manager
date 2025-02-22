import React from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import CryptoMenu from "../CryptoMenu/CryptoMenu";
import { useCryptoState } from "../../hooks/useCryptoState";
import { Menu } from "lucide-react";
import PortfolioSwitcher from "../PortfolioSwitcher/PortfolioSwitcher";
import { CryptoMenuProvider } from "../../hooks/useCryptoMenuState";

//localStorage.clear();

function Home() {
  const {
    cryptoMenuOpen,
    setCryptoMenuOpen,
    portfolios,
    currentPortfolioId,
    switchPortfolio,
    renameCurrentPortfolio,
    addPortfolio,
    removePortfolio,
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
          <button
            className={styles.menuButton}
            onClick={() => setCryptoMenuOpen((prev) => !prev)}
          >
            <Menu size={24} />
          </button>
          <PortfolioSwitcher
            portfolios={portfolios}
            currentPortfolioId={currentPortfolioId}
            switchPortfolio={switchPortfolio}
            renameCurrentPortfolio={renameCurrentPortfolio}
            addPortfolio={addPortfolio}
            removePortfolio={removePortfolio}
          />
          <h2>${totalValue.toFixed(2)}</h2>
        </div>

        <div className={styles.content}>
          {cryptoMenuOpen && <CryptoMenu />}
          <PriceList />
        </div>
      </div>
    </CryptoMenuProvider>
  );
}

export default Home;
