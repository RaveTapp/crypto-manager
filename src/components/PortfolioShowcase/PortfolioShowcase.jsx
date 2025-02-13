import React from "react";

export default function PortfolioShowcase({
  supportedCryptos,
  values,
  totalValue,
  selectedCryptos,
}) {
  return (
    <div>
      <h3>Your Portfolio Value:</h3>
      {supportedCryptos
        .filter((crypto) => selectedCryptos.includes(crypto.symbol))
        .map((crypto) => (
          <p key={crypto.symbol}>
            {crypto.name} Value: ${values[crypto.symbol]?.toFixed(2) || "0.00"}
          </p>
        ))}
      <p>
        <strong>Total Portfolio Value: ${totalValue.toFixed(2)}</strong>
      </p>
    </div>
  );
}
