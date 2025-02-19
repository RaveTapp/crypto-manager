import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./CryptoModal.module.css";
import { Edit, Plus, Save } from "lucide-react";
import { saveToStorage } from "../../utils/localStorageUtils";

export default function CryptoModal({
  crypto,
  currentHolding,
  handleHoldingsChange,
  marketData,
  closeModal,
}) {
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [
      {
        date: today,
        price: marketData[crypto.symbol]?.price || "",
        quantity: currentHolding.quantity || "",
      },
    ];
  });

  const tableRef = useRef(null);

  const toggleEditMode = () => setEditMode((prev) => !prev);

  const addRow = () => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory([...history, { date: today, price: "", quantity: "" }]);
  };

  const updateRow = (rowIndex, field, value) => {
    setHistory((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    setEditMode(false);
    // Optionally, persist history changes here.
    handleHoldingsChange(crypto.symbol, history);
  };

  const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
    const key = e.key;
    if (
      key === "ArrowRight" ||
      key === "ArrowLeft" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "Tab"
    ) {
      e.preventDefault();
      let newRow = rowIndex;
      let newCol = colIndex;
      if (key === "ArrowRight" || (key === "Tab" && !e.shiftKey)) newCol++;
      if (key === "ArrowLeft" || (key === "Tab" && e.shiftKey)) newCol--;
      if (key === "ArrowDown" ) newRow++;
      if (key === "ArrowUp" ) newRow--;
      const selector = `[data-row='${newRow}'][data-col='${newCol}']`;
      const next = document.querySelector(selector);
      if (next) next.focus();
    }
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const handleOverlayClick = () => closeModal();
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={closeModal}>
          X
        </button>
        <div className={styles.modalHeader}>
          <h2>{crypto.name} Purchase History</h2>
          <div className={styles.modalActions}>
            <button className={styles.iconButton} onClick={toggleEditMode}>
              <Edit size={20} />
            </button>
            {editMode && (
              <button className={styles.iconButton} onClick={handleSave}>
                <Save size={20} />
              </button>
            )}
          </div>
        </div>
        <div className={styles.modalContent}>
          <table ref={tableRef} className={styles.historyTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, rowIndex) => {
                const total =
                  parseFloat(row.price || 0) * parseFloat(row.quantity || 0);
                return (
                  <tr key={rowIndex}>
                    <td>
                      {editMode ? (
                        <input
                          type="date"
                          value={row.date}
                          data-row={rowIndex}
                          data-col={0}
                          onChange={(e) =>
                            updateRow(rowIndex, "date", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
                        />
                      ) : (
                        row.date
                      )}
                    </td>
                    <td>
                      {editMode ? (
                        <input
                          type="number"
                          value={row.price ? parseFloat(row.price) : ""}
                          data-row={rowIndex}
                          data-col={1}
                          step="0.01"
                          onChange={(e) =>
                            updateRow(rowIndex, "price", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                        />
                      ) : (
                        row.price ? parseFloat(row.price) : ""
                      )}
                    </td>
                    <td>
                      {editMode ? (
                        <input
                          type="number"
                          value={row.quantity ? parseFloat(row.quantity): ""}
                          data-row={rowIndex}
                          data-col={2}
                          step="0.01"
                          onChange={(e) =>
                            updateRow(rowIndex, "quantity", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                        />
                      ) : (
                        row.quantity
                      )}
                    </td>
                    <td data-row={rowIndex} data-col={3}>
                      {total ? total.toFixed(2) : "0.00"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {editMode && (
            <button className={styles.addRowButton} onClick={addRow}>
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
