import React, { useState } from "react";
import styles from "./PortfolioSwitcher.module.css";
import { ChevronDown, Edit, Plus, X } from "lucide-react";

function PortfolioSwitcher({
  portfolios,
  currentPortfolioId,
  switchPortfolio,
  renameCurrentPortfolio,
  addPortfolio,
  removePortfolio,
}) {
  const [showList, setShowList] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const currentPortfolio = portfolios.find((p) => p.id === currentPortfolioId);

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
        <button className={styles.iconButton} onClick={() => setShowList(!showList)}>
          <ChevronDown size={24} />
        </button>
        <span className={styles.currentName}>
          {currentPortfolio ? currentPortfolio.name : "No Portfolio"}
        </span>
        <button className={styles.iconButton} onClick={() => setRenaming(!renaming)}>
          <Edit size={24} />
        </button>
        <button className={styles.iconButton} onClick={addPortfolio}>
          <Plus size={24} />
        </button>
      </div>
      {showList && (
        <div className={styles.portfolioList}>
          {portfolios.map((p) => (
            <div key={p.id} className={styles.portfolioItem}>
              <span onClick={() => switchPortfolio(p.id)}>{p.name}</span>
              <button className={styles.removeButton} onClick={() => removePortfolio(p.id)}>
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

export default PortfolioSwitcher;
