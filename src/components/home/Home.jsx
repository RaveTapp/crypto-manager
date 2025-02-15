import React, { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import CryptoMenu from "../CryptoMenu/CryptoMenu";
import { supportedCryptos } from "./supportedCryptos.js";
import { Menu } from "lucide-react";

//localStorage.clear();

function Home() {
  const [cryptoMenuOpen, setCryptoMenuOpen] = useState(() => {
    const saved = localStorage.getItem("cryptoMenuOpen");
    return saved ? JSON.parse(saved) : true;
  });

  const [selectedCryptos, setSelectedCryptos] = useState(() => {
    const saved = localStorage.getItem("selectedCryptos");
    return saved ? JSON.parse(saved) : ["BTCUSDC"];
  });
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem("holdings");
    return saved
      ? JSON.parse(saved)
      : Object.fromEntries(supportedCryptos.map((c) => [c.symbol, ""]));
  });
  const [prices, setPrices] = useState(() => {
    const saved = localStorage.getItem("prices");
    return saved ? JSON.parse(saved) : {};
  });
  const [calculatedValues, setCalculatedValues] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const selectedCryptosRef = useRef(selectedCryptos);

  useEffect(() => {
    localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
    selectedCryptosRef.current = selectedCryptos;
    let newCryptos = [];
    for (const crypto of selectedCryptos) {
      if (!prices[crypto]) {
        newCryptos.push(crypto);
      }
    }
    fetchPricesForSymbols(newCryptos);
  }, [selectedCryptos]);

  useEffect(() => {
    localStorage.setItem("holdings", JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem("cryptoMenuOpen", JSON.stringify(cryptoMenuOpen));
  }, [cryptoMenuOpen]);

  useEffect(() => {
    localStorage.setItem("prices", JSON.stringify(prices));
  }, [prices]);

  const fetchPricesForSymbols = async (symbols) => {
    try {
      const newPrices = { ...prices };
      for (const symbol of symbols) {
        const response = await fetch(
          `https://data-api.binance.vision/api/v3/ticker/price?symbol=${symbol}`
        );
        const data = await response.json();
        newPrices[symbol] = parseFloat(data.price);
      }
      setPrices(newPrices);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPricesForSymbols(selectedCryptosRef.current);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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
  }, [holdings, prices, selectedCryptos]);

  const toggleSelection = (symbol) => {
    setSelectedCryptos((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleHoldingsChange = (symbol, value) => {
    setHoldings((prev) => ({ ...prev, [symbol]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.menuButton} onClick={() => setCryptoMenuOpen(!cryptoMenuOpen)}>
          <Menu size={24} />
        </button>
        <h1>Crypto Portfolio</h1>
        <h2>${totalValue.toFixed(2)}</h2>
      </div>

      <div className={styles.content}>
        {cryptoMenuOpen && (
          <CryptoMenu
            supportedCryptos={supportedCryptos}
            selectedCryptos={selectedCryptos}
            toggleSelection={toggleSelection}
          />
        )}
        <PriceList
          supportedCryptos={supportedCryptos}
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
