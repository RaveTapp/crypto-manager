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

const CryptoContext = createContext();

function useCryptoStateInternal() {
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
  const [cryptoMenuOpen, setCryptoMenuOpen] = useState(() => {
    const saved = getFromStorage("cryptoMenuOpen", true);
    return saved;
  });
  useEffect(() => {
    saveToStorage("cryptoMenuOpen", cryptoMenuOpen);
  }, [cryptoMenuOpen]);

  //const selectedCryptosRef = useRef(selectedCryptos);

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
      const amount = parseFloat(holdings[symbol]?.quantity) || 0;
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

  const addPortfolio = (afterRemove) => {
    const newId =
      portfolios.length > 0 ? Math.max(...portfolios.map((p) => p.id)) + 1 : 1;
    const newPortfolio = {
      id: newId,
      name: "New Portfolio",
      selectedCryptos: [
        {
          symbol: "BTCUSDC",
          acronym: "BTC",
          name: "Bitcoin",
          supply: 21_000_000,
          logo: "",
        },
      ],
      holdings: Object.fromEntries(
        supportedCryptos.map((c) => [
          c.symbol,
          [
            {
              date: new Date().toISOString().slice(0, 10),
              price: marketData[c.symbol]?.price || "",
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
        if (newPortfolios.length >= 1) {
          setCurrentPortfolioId(newPortfolios[0].id);
        } else {
          addPortfolio(true);
        }
      }
    }
  };

  const { decimalLength } = useMemo(() => {
    var decimalLength = {};
    Object.entries(marketData)?.map((c) => {
      var tmp = parseFloat(c[1].price)
        ?.toString()
        .split(".")[1]?.length;
        tmp > 2 ? decimalLength[c[0]] = tmp : decimalLength[c[0]] = 2
    });
    console.log(decimalLength);
    return { decimalLength };
  }, [marketData]);

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
