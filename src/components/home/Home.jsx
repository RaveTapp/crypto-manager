import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import HoldingsForm from "../HoldingsForm/HoldingsForm";
import PortfolioShowcase from "../PortfolioShowcase/PortfolioShowcase";
import CryptoMenu from "../CryptoMenu/CryptoMenu";

function Home() {
  const [selectedCryptos, setSelectedCryptos] = useState(supportedCryptos.map((c) => c.symbol));
  const [holdings, setHoldings] = useState(Object.fromEntries(supportedCryptos.map(c => [c.symbol, ''])));
  const [prices, setPrices] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPrices(setPrices);
  }, []);

  const toggleSelection = (symbol) => {
    setSelectedCryptos((prevSelected) =>
      prevSelected.includes(symbol) ? prevSelected.filter((s) => s !== symbol) : [...prevSelected, symbol]
    );
  };

  const handleChange = (symbol, value) => {
    setHoldings((prev) => ({ ...prev, [symbol]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let newCalculatedValues = {};
    let sum = 0;
    selectedCryptos.forEach((symbol) => {
      const amount = parseFloat(holdings[symbol]) || 0;
      const price = prices[symbol] || 0;
      const value = amount * price;
      newCalculatedValues[symbol] = value;
      sum += value;
    });
    setCalculatedValues(newCalculatedValues);
    setTotalValue(sum);
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <CryptoMenu
        supportedCryptos={supportedCryptos}
        selectedCryptos={selectedCryptos}
        toggleSelection={toggleSelection}
      />
      <PriceList
        supportedCryptos={supportedCryptos}
        prices={prices}
        selectedCryptos={selectedCryptos}
      />
      <HoldingsForm
        supportedCryptos={supportedCryptos}
        holdings={holdings}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        selectedCryptos={selectedCryptos}
      />
      {submitted && (
        <PortfolioShowcase
          supportedCryptos={supportedCryptos}
          values={calculatedValues}
          totalValue={totalValue}
          selectedCryptos={selectedCryptos}
        />
      )}
    </div>
  );
}

export default Home;

const supportedCryptos = [
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=013'
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=013'
  }
];

async function fetchPrices(setPrices) {
  try {
    const btcResponse = await fetch(
      "https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcData = await btcResponse.json();

    const ethResponse = await fetch(
      "https://data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT"
    );
    const ethData = await ethResponse.json();

    setPrices({
      BTCUSDT: parseFloat(btcData.price),
      ETHUSDT: parseFloat(ethData.price),
    });
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}
