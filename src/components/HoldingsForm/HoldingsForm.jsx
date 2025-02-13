import React from 'react';
import styles from "../home/Home.module.css";

export default function HoldingsForm({
  btcHoldings,
  setBtcHoldings,
  ethHoldings,
  setEthHoldings,
  handleSubmit,
}) {
  return (
    <div>
      <h2>Enter Your Holdings</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="btc" className={styles.formLabel}>
            Bitcoin Holdings (BTC):
          </label>
          <input
            type="text"
            id="btc"
            value={btcHoldings}
            onChange={(e) => setBtcHoldings(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="eth" className={styles.formLabel}>
            Ethereum Holdings (ETH):
          </label>
          <input
            type="text"
            id="eth"
            value={ethHoldings}
            onChange={(e) => setEthHoldings(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.button}>
          Calculate Portfolio Value
        </button>
      </form>
    </div>
  );
}
