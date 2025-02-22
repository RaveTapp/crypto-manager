import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import { getFromStorage, saveToStorage } from "../utils/localStorageUtils";
import { fetchMarketData } from "../services/cryptoService";
import { supportedCryptos } from "../supportedCryptos";
import { usePortfolioState } from "./usePortfolioState";

const CryptoContext = createContext();

function useCryptoStateInternal() {
  const {
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
  } = usePortfolioState();

  // MARKET DATA
  const [marketData, setMarketData] = useState(() =>
    getFromStorage("marketData", {})
  );
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

  const decimalLength = useMemo(() => {
    let decimalLength = {};
    Object.entries(marketData)?.map((c) => {
      var tmp = parseFloat(c[1].price)?.toString().split(".")[1]?.length;
      tmp > 2 ? (decimalLength[c[0]] = tmp) : (decimalLength[c[0]] = 2);
    });
    return decimalLength;
  }, [marketData]);

  const [calculatedValues, setCalculatedValues] = useState({});
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    let sum = 0;
    const newCalculatedValues = selectedCryptos.reduce((acc, crypto) => {
      const symbol = crypto.symbol;
      const amount = parseFloat(holdingsTotal[symbol]) || 0;
      const price = marketData[symbol]?.price || 0;
      acc[symbol] = amount * price;
      sum += amount * price;
      return acc;
    }, {});
    setCalculatedValues(newCalculatedValues);
    setTotalValue(sum);
  }, [holdings, marketData, selectedCryptos]);

  // OTHER STATE & FUNCTIONS
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

  const [cryptoMenuOpen, setCryptoMenuOpen] = useState(() =>
    getFromStorage("cryptoMenuOpen", true)
  );
  useEffect(() => {
    saveToStorage("cryptoMenuOpen", cryptoMenuOpen);
  }, [cryptoMenuOpen]);

  const [holdingsTotal, setHoldingsTotal] = useState(() =>
    getFromStorage("holdingsTotal", {})
  );

  useEffect(() => {
    saveToStorage("holdingsTotal", holdingsTotal);
  }, [holdingsTotal]);

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
    decimalLength,
    holdingsTotal,
    setHoldingsTotal,
  };
}

export function CryptoProvider({ children }) {
  const cryptoState = useCryptoStateInternal();
  return (
    <CryptoContext.Provider value={cryptoState}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCryptoState() {
  return useContext(CryptoContext);
}
