import { useMemo } from "react";
import styles from "./CryptoStat.module.css";

export default function CryptoStat({history, decimalLength}) {
  const { totalQuantity, totalSpent, averagePrice } = useMemo(() => {
    const totalQuantity = history.reduce(
      (sum, row) => sum + (parseFloat(row.quantity) || 0),
      0
    );
    const totalSpent = history.reduce(
      (sum, row) =>
        sum + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
      0
    );
    const averagePrice = totalQuantity ? totalSpent / totalQuantity : 0;
    return { totalQuantity, totalSpent, averagePrice };
  }, [history]);

  return (
    <div className={styles.statistics}>
      <div className={styles.tooltipWrapper}>
        <span className={styles.tooltip}>Total quantity</span>
        <span className={styles.statValue}>
          Q: {totalQuantity.toFixed(decimalLength || 3)}
        </span>
      </div>

      <div className={styles.tooltipWrapper}>
        <span className={styles.tooltip}>Total amount</span>
        <span className={styles.statValue}>
          T: ${totalSpent.toFixed(decimalLength || 3)}
        </span>
      </div>

      <div className={styles.tooltipWrapper}>
        <span className={styles.tooltip}>Average price</span>
        <span className={styles.statValue}>
          AVG: ${averagePrice.toFixed(decimalLength || 3)}
        </span>
      </div>
    </div>
  );
}
