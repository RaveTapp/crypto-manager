import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./CryptoModal.module.css";
import { Edit, Plus, Save, Trash } from "lucide-react";
import CryptoStat from "./CryptoStat.jsx/CryptoStat";
import { useCryptoState } from "../../hooks/useCryptoState";

export default function CryptoModal({ crypto, closeModal }) {
  const { holdings, handleHoldingsChange, marketData, decimalLength } =
    useCryptoState();
  const currentHolding = holdings[crypto.symbol];

  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (currentHolding) return currentHolding;
    return [
      {
        date: today,
        price: marketData[crypto.symbol]?.price || "",
        quantity: "",
      },
    ];
  });
  const [firstRemoveConfirmed, setFirstRemoveConfirmed] = useState(false);

  const tableRef = useRef(null);

  const toggleEditMode = () => setEditMode((prev) => !prev);

  const addRow = () => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory([...history, { date: today, price: "", quantity: "" }]);
  };

  const removeRow = (rowIndex) => {
    if (!firstRemoveConfirmed) {
      const confirmDelete = window.confirm(
        "Are you sure you want to remove this entry?"
      );
      if (!confirmDelete) return;
      setFirstRemoveConfirmed(true);
    }
    setHistory((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  const updateRow = (rowIndex, field, value) => {
    setHistory((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    setEditMode(false);
    setFirstRemoveConfirmed(false);
    handleHoldingsChange(crypto.symbol, history);
  };

  const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
    const key = e.key;
    if (key === "Tab") {
      e.preventDefault();
      let newRow = rowIndex;
      let newCol = colIndex;
      if (key === "Tab" && !e.shiftKey) newCol++;
      if (key === "Tab" && e.shiftKey) newCol--;
      const selector = `[data-row='${newRow}'][data-col='${newCol}']`;
      const next = document.querySelector(selector);
      if (next) next.focus();
    }
  }, []);

  const limitInputLength = (e) => {
    if (e.target.value.length > 15)
      e.target.value = e.target.value.slice(0, 15);
  };

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

        <CryptoStat
          history={history}
          decimalLength={decimalLength[crypto.symbol]}
        />

        <div className={styles.modalContent}>
          <table ref={tableRef} className={styles.historyTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                {editMode && <th>Actions</th>}
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
                          onInput={(e) => limitInputLength(e)}
                        />
                      ) : row.price ? (
                        parseFloat(row.price)
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {editMode ? (
                        <input
                          type="number"
                          value={row.quantity ? parseFloat(row.quantity) : ""}
                          data-row={rowIndex}
                          data-col={2}
                          step="0.01"
                          onChange={(e) =>
                            updateRow(rowIndex, "quantity", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                          onInput={(e) => limitInputLength(e)}
                        />
                      ) : (
                        row.quantity
                      )}
                    </td>
                    <td data-row={rowIndex} data-col={3}>
                      {total
                        ? parseFloat(
                            total.toFixed(decimalLength[crypto.symbol] || 3)
                          )
                        : "0.00"}
                    </td>
                    {editMode && (
                      <td>
                        <button
                          className={styles.iconButton}
                          onClick={() => removeRow(rowIndex)}
                        >
                          <Trash size={20} />
                        </button>
                      </td>
                    )}
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
