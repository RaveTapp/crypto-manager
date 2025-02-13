import React from "react";
import styles from "../home/Home.module.css";

export default function HoldingsForm({
  supportedCryptos,
  holdings,
  handleChange,
  handleSubmit,
  selectedCryptos,
}) {
  return (
    <div>
      <h2>Enter Your Holdings</h2>
      <form onSubmit={handleSubmit}>
        {supportedCryptos
          .filter((crypto) => selectedCryptos.includes(crypto.symbol))
          .map((crypto) => (
            <div key={crypto.symbol} className={styles.formGroup}>
              <label htmlFor={crypto.symbol} className={styles.formLabel}>
                {crypto.name} Holdings:
              </label>
              <input
                type="text"
                id={crypto.symbol}
                value={holdings[crypto.symbol]}
                onChange={(e) => handleChange(crypto.symbol, e.target.value)}
              />
            </div>
          ))}
        <button type="submit" className={styles.button}>
          Calculate Portfolio Value
        </button>
      </form>
    </div>
  );
}
