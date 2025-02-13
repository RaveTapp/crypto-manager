import React from "react";

export default function PriceList({
  supportedCryptos,
  prices,
  selectedCryptos,
}) {
  return (
    <div>
      <h1>Current Cryptocurrency Prices</h1>
      <ul>
        {supportedCryptos
          .filter((crypto) => selectedCryptos.includes(crypto.symbol))
          .map((crypto) => (
            <li key={crypto.symbol}>
              {crypto.name} ({crypto.symbol}): $
              {prices[crypto.symbol]?.toFixed(2) || "N/A"}
            </li>
          ))}
      </ul>
    </div>
  );
}
