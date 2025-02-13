import React from 'react';

export default function PriceList({ prices }) {
  return (
    <div>
      <h1>Current Cryptocurrency Prices</h1>
      <ul>
        <li>
          Bitcoin (BTC): ${prices.BTCUSDT ? prices.BTCUSDT.toFixed(2) : "N/A"}
        </li>
        <li>
          Ethereum (ETH): ${prices.ETHUSDT ? prices.ETHUSDT.toFixed(2) : "N/A"}
        </li>
      </ul>
    </div>
  );
}
