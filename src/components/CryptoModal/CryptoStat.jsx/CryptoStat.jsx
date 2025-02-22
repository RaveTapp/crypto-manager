import { useMemo } from "react";
import styles from "./CryptoStat.module.css";

export default function CryptoStat({ history, decimalLength }) {
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

    totalQuantity = parseFloat(totalQuantity.toFixed(decimalLength));
    totalSpent = parseFloat(totalSpent.toFixed(decimalLength));
    averagePrice = parseFloat(averagePrice.toFixed(decimalLength));
    return { totalQuantity, totalSpent, averagePrice };
  }, [history]);

  return (
    <div className={styles.statistics}>
      <div className={styles.tooltipWrapper}>
        <span className={styles.tooltip}>Total quantity</span>
        <span className={styles.statValue}>Q: {totalQuantity}</span>
      </div>

      <div className={styles.tooltipWrapper}>
        <span className={styles.tooltip}>Total amount</span>
        <span className={styles.statValue}>T: ${totalSpent}</span>
      </div>

      <div className={styles.tooltipWrapper}>
        <span className={styles.tooltip}>Average price</span>
        <span className={styles.statValue}>AVG: ${averagePrice}</span>
      </div>
    </div>
  );
}
