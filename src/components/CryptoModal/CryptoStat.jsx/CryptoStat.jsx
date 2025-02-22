import { useEffect, useMemo } from "react";
import styles from "./CryptoStat.module.css";
import { useCryptoState } from "../../../hooks/useCryptoState";

export default function CryptoStat({ history, decimalLength, price, symbol }) {
  const {setHoldingsTotal} = useCryptoState();

  const { totalQuantity, totalSpent, averagePrice } = useMemo(() => {
    let totalQuantity = history.reduce(
      (sum, row) => sum + (parseFloat(row.quantity) || 0),
      0
    );
    
    let totalSpent = history.reduce(
      (sum, row) =>
        sum + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
      0
    );
    let averagePrice = totalQuantity ? totalSpent / totalQuantity : 0;

    totalSpent = parseFloat(totalSpent.toFixed(decimalLength));
    averagePrice = parseFloat(averagePrice.toFixed(decimalLength));
    return { totalQuantity, totalSpent, averagePrice };
  }, [history]);

  useEffect(() => {
    setHoldingsTotal((prev) => ({ ...prev, [symbol]: totalQuantity }));
  }, [totalQuantity]);

  const profit = parseFloat(((price-averagePrice)*totalQuantity).toFixed(decimalLength));
  return (
    <>
      <div className={styles.statistics}>
        <div className={styles.tooltipWrapper}>
          <span className={styles.tooltip}>Total quantity</span>
          <span className={styles.statValue}>Q: {totalQuantity}</span>
        </div>

        <div className={styles.tooltipWrapper}>
          <span className={styles.tooltip}>Total spent</span>
          <span className={styles.statValue}>T: ${totalSpent}</span>
        </div>

        <div className={styles.tooltipWrapper}>
          <span className={styles.tooltip}>Average price</span>
          <span className={styles.statValue}>AVG: ${averagePrice}</span>
        </div>
      </div>
      <div className={styles.cryptoValue} style={profit < 0 ? { color: "red" } : {}}>
        Profit/Loss: ${profit}
      </div>
    </>
  );
}
