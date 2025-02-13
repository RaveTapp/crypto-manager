import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import HoldingsForm from "../HoldingsForm/HoldingsForm";
import PortfolioShowcase from "../PortfolioShowcase/PortfolioShowcase";
import CryptoMenu from "../CryptoMenu/CryptoMenu";
import { supportedCryptos } from "./supportedCryptos";

function Home() {
  const [selectedCryptos, setSelectedCryptos] = useState(
    ["BTCUSDT"]
  );
  const [holdings, setHoldings] = useState(
    Object.fromEntries(supportedCryptos.map((c) => [c.symbol, ""]))
  );
  const [prices, setPrices] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPrices(setPrices);
  }, []);

  const toggleSelection = (symbol) => {
    setSelectedCryptos((prevSelected) =>
      prevSelected.includes(symbol)
        ? prevSelected.filter((s) => s !== symbol)
        : [...prevSelected, symbol]
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

async function fetchPrices(setPrices) {
  try {
    const newPrices = {};
    for (const crypto of supportedCryptos) {
      const response = await fetch(
        `https://data-api.binance.vision/api/v3/ticker/price?symbol=${crypto.symbol}`
      );
      const data = await response.json();
      newPrices[crypto.symbol] = parseFloat(data.price);
    }
    setPrices(newPrices);
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}
