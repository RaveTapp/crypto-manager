import { useState, useEffect, useRef } from "react";
import { getFromStorage, saveToStorage } from "../utils/localStorageUtils";
import { fetchPricesForSymbols } from "../services/cryptoService";
import { supportedCryptos } from "../supportedCryptos";

export function useCryptoState() {
    const [cryptoMenuOpen, setCryptoMenuOpen] = useState(getFromStorage("cryptoMenuOpen", true));
    const [selectedCryptos, setSelectedCryptos] = useState(getFromStorage("selectedCryptos", ["BTCUSDC"]));
    const [holdings, setHoldings] = useState(getFromStorage("holdings", Object.fromEntries(supportedCryptos.map((c) => [c.symbol, ""]))));
    const [prices, setPrices] = useState(getFromStorage("prices", {}));
    const [calculatedValues, setCalculatedValues] = useState({});
    const [totalValue, setTotalValue] = useState(0);

    const selectedCryptosRef = useRef(selectedCryptos);

    useEffect(() => {
        saveToStorage("selectedCryptos", selectedCryptos);
        selectedCryptosRef.current = selectedCryptos;
        const newCryptos = selectedCryptos.filter((crypto) => !prices[crypto]);
        fetchPricesForSymbols(newCryptos, setPrices);
    }, [selectedCryptos]);

    useEffect(() => saveToStorage("holdings", holdings), [holdings]);
    useEffect(() => saveToStorage("cryptoMenuOpen", cryptoMenuOpen), [cryptoMenuOpen]);
    useEffect(() => saveToStorage("prices", prices), [prices]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPricesForSymbols(selectedCryptosRef.current, setPrices);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let sum = 0;
        const newCalculatedValues = selectedCryptos.reduce((acc, symbol) => {
            const amount = parseFloat(holdings[symbol]) || 0;
            const price = prices[symbol] || 0;
            acc[symbol] = amount * price;
            sum += amount * price;
            return acc;
        }, {});
        setCalculatedValues(newCalculatedValues);
        setTotalValue(sum);
    }, [holdings, prices, selectedCryptos]);

    return {
        cryptoMenuOpen,
        setCryptoMenuOpen,
        selectedCryptos,
        toggleSelection: (symbol) => setSelectedCryptos((prev) => prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]),
        holdings,
        handleHoldingsChange: (symbol, value) => setHoldings((prev) => ({ ...prev, [symbol]: value })),
        prices,
        calculatedValues,
        totalValue,
    };
}
