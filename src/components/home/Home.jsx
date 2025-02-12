import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  // State to hold prices for both BTC and ETH
  const [prices, setPrices] = useState({ BTCUSDT: 0, ETHUSDT: 0 });

  // State for user inputs
  const [btcHoldings, setBtcHoldings] = useState("");
  const [ethHoldings, setEthHoldings] = useState("");

  // State for calculated values
  const [btcValue, setBtcValue] = useState(0);
  const [ethValue, setEthValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Function to fetch both BTC and ETH prices concurrently
    const fetchPrices = async () => {
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
    };

    fetchPrices();
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
    <div className="container">
      <h1>Current Cryptocurrency Prices</h1>
      <ul>
        <li>
          Bitcoin (BTC): ${prices.BTCUSDT ? prices.BTCUSDT.toFixed(2) : "N/A"}
        </li>
        <li>
          Ethereum (ETH): ${prices.ETHUSDT ? prices.ETHUSDT.toFixed(2) : "N/A"}
        </li>
      </ul>

      <h2>Enter Your Holdings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="btc" className="form-label">
            Bitcoin Holdings (BTC):
          </label>
          <input
            type="text"
            id="btc"
            value={btcHoldings}
            onChange={(e) => setBtcHoldings(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="eth" className="form-label">
            Ethereum Holdings (ETH):
          </label>
          <input
            type="text"
            id="eth"
            value={ethHoldings}
            onChange={(e) => setEthHoldings(e.target.value)}
          />
        </div>
        <button type="submit" className="button">
          Calculate Portfolio Value
        </button>
      </form>

      {submitted && (
        <div>
          <h3>Your Portfolio Value:</h3>
          <p>Bitcoin Value: ${btcValue.toFixed(2)}</p>
          <p>Ethereum Value: ${ethValue.toFixed(2)}</p>
          <p>
            <strong>Total Portfolio Value: ${totalValue.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
