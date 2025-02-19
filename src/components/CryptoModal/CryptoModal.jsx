import React, { useEffect, useState } from "react";
import styles from "./CryptoModal.module.css";
import { Edit, Plus, Save } from "lucide-react";

export default function CryptoModal({ crypto, closeModal }) {
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState([]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const addRow = () => {
    setHistory([...history, { date: "", price: "", quantity: "" }]);
  };

  const updateRow = (index, field, value) => {
    setHistory(
      history.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSave = () => {
    setEditMode(false);
    // Optionally, persist history here.
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
        <div className={styles.modalContent}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index}>
                  <td>
                    {editMode ? (
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(e) =>
                          updateRow(index, "date", e.target.value)
                        }
                      />
                    ) : (
                      entry.date
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        type="number"
                        value={entry.price}
                        onChange={(e) =>
                          updateRow(index, "price", e.target.value)
                        }
                        step="0.01"
                      />
                    ) : (
                      entry.price
                    )}
                  </td>
                  <td>
                    {editMode ? (
                      <input
                        type="number"
                        value={entry.quantity}
                        onChange={(e) =>
                          updateRow(index, "quantity", e.target.value)
                        }
                        step="0.01"
                      />
                    ) : (
                      entry.quantity
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editMode && (
            <button className={styles.addRowButton} onClick={addRow}>
              <Plus size={20} /> Add Row
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
