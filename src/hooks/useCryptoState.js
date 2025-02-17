import { useState, useEffect, useRef } from "react";
import { getFromStorage, saveToStorage } from "../utils/localStorageUtils";
import { fetchMarketData } from "../services/cryptoService";
import { supportedCryptos } from "../supportedCryptos";

export function useCryptoState() {
  const [portfolios, setPortfolios] = useState(() => {
    const saved = getFromStorage("portfolios", null);
    if (saved) return saved;
    return [
      {
        id: 1,
        name: "Default Portfolio",
        selectedCryptos: [
          { symbol: "BTCUSDC", acronym: "BTC", name: "Bitcoin", logo: "" },
        ],
        holdings: Object.fromEntries(
          supportedCryptos.map((c) => [c.symbol, ""])
        ),
      },
    ];
  });
  const [currentPortfolioId, setCurrentPortfolioId] = useState(() => {
    const saved = getFromStorage("currentPortfolioId", null);
    return saved || 1;
  });

  let currentPortfolio = portfolios.find((p) => p.id === currentPortfolioId);
  const [selectedCryptos, setSelectedCryptos] = useState(
    currentPortfolio.selectedCryptos
  );
  const [holdings, setHoldings] = useState(currentPortfolio.holdings);
  const [marketData, setMarketData] = useState(() =>
    getFromStorage("marketData", {})
  );
  const [calculatedValues, setCalculatedValues] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [cryptoMenuOpen, setCryptoMenuOpen] = useState(true);
  const selectedCryptosRef = useRef(selectedCryptos);

  useEffect(() => {
    saveToStorage("portfolios", portfolios);
  }, [portfolios]);

  useEffect(() => {
    saveToStorage("currentPortfolioId", currentPortfolioId);
    currentPortfolio = portfolios.find((p) => p.id === currentPortfolioId);
    setSelectedCryptos(currentPortfolio.selectedCryptos);
    setHoldings(currentPortfolio.holdings);
  }, [currentPortfolioId]);

  useEffect(() => {
    setPortfolios((prev) =>
      prev.map((p) =>
        p.id === currentPortfolioId ? { ...p, selectedCryptos, holdings } : p
      )
    );
  }, [selectedCryptos, holdings, currentPortfolioId]);

  useEffect(() => {
    saveToStorage("marketData", marketData);
  }, [marketData]);

  useEffect(() => {
    fetchMarketData(supportedCryptos, setMarketData);

    const interval = setInterval(() => {
      fetchMarketData(supportedCryptos, setMarketData);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let sum = 0;
    const newCalculatedValues = selectedCryptos.reduce((acc, crypto) => {
      const symbol = crypto.symbol;
      const amount = parseFloat(holdings[symbol]) || 0;
      const price = marketData[symbol]?.price || 0;
      acc[symbol] = amount * price;
      sum += amount * price;
      return acc;
    }, {});
    setCalculatedValues(newCalculatedValues);
    setTotalValue(sum);
  }, [holdings, marketData, selectedCryptos]);

  const toggleSelection = (symbol) => {
    setSelectedCryptos((prev) => {
      if (prev.some((item) => item.symbol === symbol)) {
        return prev.filter((item) => item.symbol !== symbol);
      } else {
        const cryptoObj = supportedCryptos.find((c) => c.symbol === symbol);
        return cryptoObj ? [...prev, cryptoObj] : prev;
      }
    });
  };

  const handleHoldingsChange = (symbol, value) => {
    setHoldings((prev) => ({ ...prev, [symbol]: value }));
  };

  const switchPortfolio = (id) => {
    setCurrentPortfolioId(id);
  };

  const renameCurrentPortfolio = (newName) => {
    setPortfolios((prev) =>
      prev.map((p) =>
        p.id === currentPortfolioId ? { ...p, name: newName } : p
      )
    );
  };

  const addPortfolio = () => {
    const newId =
      portfolios.length > 0 ? Math.max(...portfolios.map((p) => p.id)) + 1 : 1;
    const newPortfolio = {
      id: newId,
      name: "New Portfolio",
      selectedCryptos: [
        { symbol: "BTCUSDC", acronym: "BTC", name: "Bitcoin", logo: "" },
      ],
      holdings: Object.fromEntries(supportedCryptos.map((c) => [c.symbol, ""])),
    };
    setPortfolios([...portfolios, newPortfolio]);
    setCurrentPortfolioId(newId);
  };

  const removePortfolio = (id) => {
    if (window.confirm("Are you sure you want to remove this portfolio?")) {
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
      if (id === currentPortfolioId && portfolios.length > 1) {
        setCurrentPortfolioId(portfolios[0].id);
      }
    }
  };

  return {
    cryptoMenuOpen,
    setCryptoMenuOpen,
    selectedCryptos,
    toggleSelection,
    holdings,
    handleHoldingsChange,
    marketData,
    calculatedValues,
    totalValue,
    portfolios,
    currentPortfolioId,
    switchPortfolio,
    renameCurrentPortfolio,
    addPortfolio,
    removePortfolio,
  };
}
