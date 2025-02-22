import { useState, useEffect } from "react";
import { getFromStorage, saveToStorage } from "../utils/localStorageUtils";
import { supportedCryptos } from "../supportedCryptos";

export function usePortfolioState() {
  const [portfolios, setPortfolios] = useState(() => {
    const saved = getFromStorage("portfolios", null);
    return (
      saved || [
        {
          id: 1,
          name: "Default Portfolio",
          selectedCryptos: [
            { symbol: "BTCUSDC", acronym: "BTC", name: "Bitcoin", logo: "" },
          ],
          holdings: Object.fromEntries(
            supportedCryptos.map((c) => [
              c.symbol,
              [
                {
                  date: new Date().toISOString().slice(0, 10),
                  price: "",
                  quantity: "",
                },
              ],
            ])
          ),
        },
      ]
    );
  });

  const [currentPortfolioId, setCurrentPortfolioId] = useState(() => {
    return getFromStorage("currentPortfolioId", 1);
  });

  useEffect(() => {
    saveToStorage("portfolios", portfolios);
  }, [portfolios]);

  let currentPortfolio =
    portfolios.find((p) => p.id === currentPortfolioId) || portfolios[0];

  useEffect(() => {
    saveToStorage("currentPortfolioId", currentPortfolioId);
    currentPortfolio =
      portfolios.find((p) => p.id === currentPortfolioId) || portfolios[0];
    setSelectedCryptos(currentPortfolio.selectedCryptos);
    setHoldings(currentPortfolio.holdings);
  }, [currentPortfolioId]);

  const [selectedCryptos, setSelectedCryptos] = useState(
    currentPortfolio.selectedCryptos
  );
  const [holdings, setHoldings] = useState(currentPortfolio.holdings);

  useEffect(() => {
    setPortfolios((prev) =>
      prev.map((p) =>
        p.id === currentPortfolioId ? { ...p, selectedCryptos, holdings } : p
      )
    );
  }, [selectedCryptos, holdings, currentPortfolioId]);

  const addPortfolio = (afterRemove) => {
    const newId =
      portfolios.length > 0 ? Math.max(...portfolios.map((p) => p.id)) + 1 : 1;
    const newPortfolio = {
      id: newId,
      name: "New Portfolio",
      selectedCryptos: [
        { symbol: "BTCUSDC", acronym: "BTC", name: "Bitcoin", logo: "" },
      ],
      holdings: Object.fromEntries(
        supportedCryptos.map((c) => [
          c.symbol,
          [
            {
              date: new Date().toISOString().slice(0, 10),
              price: "",
              quantity: "",
            },
          ],
        ])
      ),
    };
    afterRemove
      ? setPortfolios([newPortfolio])
      : setPortfolios([...portfolios, newPortfolio]);
    setCurrentPortfolioId(newId);
  };

  const removePortfolio = (id) => {
    if (window.confirm("Are you sure you want to remove this portfolio?")) {
      const newPortfolios = portfolios.filter((p) => p.id !== id);
      setPortfolios(newPortfolios);
      if (id === currentPortfolioId) {
        setCurrentPortfolioId(newPortfolios.length ? newPortfolios[0].id : 1);
        if (!newPortfolios.length) addPortfolio(true);
      }
    }
  };

  const switchPortfolio = (id) => setCurrentPortfolioId(id);
  const renameCurrentPortfolio = (newName) => {
    setPortfolios((prev) =>
      prev.map((p) =>
        p.id === currentPortfolioId ? { ...p, name: newName } : p
      )
    );
  };

  return {
    portfolios,
    currentPortfolioId,
    switchPortfolio,
    renameCurrentPortfolio,
    addPortfolio,
    removePortfolio,
    selectedCryptos,
    setSelectedCryptos,
    holdings,
    setHoldings,
  };
}
