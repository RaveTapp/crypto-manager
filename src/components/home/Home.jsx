import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import PortfolioShowcase from "../PortfolioShowcase/PortfolioShowcase";
import CryptoMenu from "../CryptoMenu/CryptoMenu";
import { supportedCryptos } from "./supportedCryptos.js";

function Home() {
  const [selectedCryptos, setSelectedCryptos] = useState(() => {
    const saved = localStorage.getItem("selectedCryptos");
    return saved ? JSON.parse(saved) : ["BTCUSDT"];
  });

  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem("holdings");
    return saved
      ? JSON.parse(saved)
      : Object.fromEntries(supportedCryptos.map((c) => [c.symbol, ""]));
  });

  const [prices, setPrices] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPrices(setPrices);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
  }, [selectedCryptos]);

  useEffect(() => {
    localStorage.setItem("holdings", JSON.stringify(holdings));
  }, [holdings]);

  const toggleSelection = (symbol) => {
    setSelectedCryptos((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleHoldingsChange = (symbol, value) => {
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
      <form onSubmit={handleSubmit}>
        <PriceList
          supportedCryptos={supportedCryptos}
          prices={prices}
          selectedCryptos={selectedCryptos}
          holdings={holdings}
          handleHoldingsChange={handleHoldingsChange}
          calculatedValues={calculatedValues}
        />
        <button type="submit" className={styles.button}>
          Calculate Portfolio Value
        </button>
      </form>
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
