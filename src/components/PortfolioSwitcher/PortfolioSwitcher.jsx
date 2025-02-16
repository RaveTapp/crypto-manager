import React, { useState } from "react";
import styles from "./PortfolioSwitcher.module.css";
import { ChevronDown, Edit, Plus, X } from "lucide-react";

function PortfolioSwitcher() {
  const [portfolios, setPortfolios] = useState([
    { id: 1, name: "Default Portfolio" },
  ]);
  const [currentPortfolioId, setCurrentPortfolioId] = useState(1);
  const [showList, setShowList] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const currentPortfolio = portfolios.find((p) => p.id === currentPortfolioId);

  const handlePortfolioClick = (id) => {
    setCurrentPortfolioId(id);
    setShowList(false);
    setRenaming(false);
  };

  const handleRename = () => {
    if (newName.trim()) {
      setPortfolios(
        portfolios.map((p) =>
          p.id === currentPortfolioId ? { ...p, name: newName } : p
        )
      );
      setNewName("");
      setRenaming(false);
    }
  };

  const handleAddPortfolio = () => {
    const newId =
      portfolios.length > 0 ? Math.max(...portfolios.map((p) => p.id)) + 1 : 1;
    const newPortfolio = { id: newId, name: "New Portfolio" };
    setPortfolios([...portfolios, newPortfolio]);
    setCurrentPortfolioId(newId);
  };

  const handleRemovePortfolio = (id) => {
    if (window.confirm("Are you sure you want to remove this portfolio?")) {
      const updated = portfolios.filter((p) => p.id !== id);
      setPortfolios(updated);
      if (id === currentPortfolioId && updated.length > 0) {
        setCurrentPortfolioId(updated[0].id);
      }
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
        <button className={styles.iconButton} onClick={handleAddPortfolio}>
          <Plus size={24} />
        </button>
      </div>
      {showList && (
        <div className={styles.portfolioList}>
          {portfolios.map((p) => (
            <div key={p.id} className={styles.portfolioItem}>
              <span onClick={() => handlePortfolioClick(p.id)}>{p.name}</span>
              <button
                className={styles.removeButton}
                onClick={() => handleRemovePortfolio(p.id)}
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

export default PortfolioSwitcher;
