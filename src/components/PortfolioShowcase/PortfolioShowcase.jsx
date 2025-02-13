import React from 'react';

export default function PortfolioShowcase({ btcValue, ethValue, totalValue }) {
  return (
    <div>
      <h3>Your Portfolio Value:</h3>
      <p>Bitcoin Value: ${btcValue.toFixed(2)}</p>
      <p>Ethereum Value: ${ethValue.toFixed(2)}</p>
      <p>
        <strong>Total Portfolio Value: ${totalValue.toFixed(2)}</strong>
      </p>
    </div>
  );
}
