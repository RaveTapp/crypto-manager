import React, { useEffect } from "react";
import styles from "./CryptoModal.module.css";

export default function CryptoModal({ crypto, closeModal }) {
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
        <div className={styles.modalContent}>
          <h2>{crypto.name} Details</h2>
          <p>Symbol: {crypto.symbol}</p>
          {/* Additional details can be added here */}
        </div>
      </div>
    </div>
  );
}
