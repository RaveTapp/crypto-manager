import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PriceList from "../PriceList/PriceList";
import HoldingsForm from "../HoldingsForm/HoldingsForm";
import PortfolioShowcase from "../PortfolioShowcase/PortfolioShowcase";

function Home() {
  const [prices, setPrices] = useState({ BTCUSDT: 0, ETHUSDT: 0 });

  const [btcHoldings, setBtcHoldings] = useState("");
  const [ethHoldings, setEthHoldings] = useState("");

  const [btcValue, setBtcValue] = useState(0);
  const [ethValue, setEthValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPrices(setPrices);
  }, []);

  // Handle form submission to calculate portfolio values
  const handleSubmit = (event) => {
    event.preventDefault();

    const btcAmount = parseFloat(btcHoldings) || 0;
    const ethAmount = parseFloat(ethHoldings) || 0;

    const btcPrice = prices.BTCUSDT || 0;
    const ethPrice = prices.ETHUSDT || 0;

    const calculatedBtcValue = btcAmount * btcPrice;
    const calculatedEthValue = ethAmount * ethPrice;

    setBtcValue(calculatedBtcValue);
    setEthValue(calculatedEthValue);
    setTotalValue(calculatedBtcValue + calculatedEthValue);
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <PriceList prices={prices} />
      <HoldingsForm
        btcHoldings={btcHoldings}
        setBtcHoldings={setBtcHoldings}
        ethHoldings={ethHoldings}
        setEthHoldings={setEthHoldings}
        handleSubmit={handleSubmit}
      />
      {submitted && (
        <PortfolioShowcase
          btcValue={btcValue}
          ethValue={ethValue}
          totalValue={totalValue}
        />
      )}
    </div>
  );
}

export default Home;

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
