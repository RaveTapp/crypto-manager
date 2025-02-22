import React, { useState } from "react";
import styles from "./PortfolioSwitcher.module.css";
import { ChevronDown, Edit, Plus, X } from "lucide-react";
import { useCryptoState } from "../../hooks/useCryptoState";

export default function PortfolioSwitcher() {
  const {
    portfolios,
    currentPortfolioId,
    switchPortfolio,
    renameCurrentPortfolio,
    addPortfolio,
    removePortfolio,
  } = useCryptoState();

  const [showList, setShowList] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const currentPortfolio = portfolios?.find((p) => p.id === currentPortfolioId);

  const handleRename = () => {
    if (newName.trim()) {
      renameCurrentPortfolio(newName);
      setNewName("");
      setRenaming(false);
    }
  };

  return (
    <div className={styles.portfolioSwitcher}>
      <div className={styles.topRow}>
        <button
          className={styles.iconButton}
          onClick={() => setShowList(!showList)}
        >
          <ChevronDown size={24} />
        </button>
        <span className={styles.currentName}>
          {currentPortfolio ? currentPortfolio.name : "No Portfolio"}
        </span>
        <button
          className={styles.iconButton}
          onClick={() => setRenaming(!renaming)}
        >
          <Edit size={24} />
        </button>
        <button
          className={styles.iconButton}
          onClick={() => addPortfolio(false)}
        >
          <Plus size={24} />
        </button>
      </div>
      {showList && (
        <div className={styles.portfolioList}>
          {portfolios.map((p) => (
            <div
              key={p.id}
              className={styles.portfolioItem}
              onClick={() => switchPortfolio(p.id)}
            >
              <span>{p.name}</span>
              <button
                className={styles.removeButton}
                onClick={(event) => {
                  removePortfolio(p.id);
                  event.stopPropagation();
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {renaming && (
        <div className={styles.renameSection}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            className={styles.renameInput}
          />
          <button className={styles.confirmButton} onClick={handleRename}>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
