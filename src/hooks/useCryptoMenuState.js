import { useState, useEffect, useMemo } from "react";
import { getFromStorage, saveToStorage } from "../utils/localStorageUtils";

export function useCryptoMenuState(
  supportedCryptos,
  marketData,
  selectedCryptos
) {
  const [searchQuery, setSearchQuery] = useState(() =>
    getFromStorage("cryptoMenu_searchQuery", "")
  );
  const [onlySelected, setOnlySelected] = useState(() =>
    getFromStorage("cryptoMenu_onlySelected", false)
  );
  const [sortCriteria, setSortCriteria] = useState(() =>
    getFromStorage("cryptoMenu_sortCriteria", "alphabetical")
  );
  const [maxCoins, setMaxCoins] = useState(() =>
    getFromStorage("cryptoMenu_maxCoins", supportedCryptos.length)
  );

  useEffect(() => {
    saveToStorage("cryptoMenu_searchQuery", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    saveToStorage("cryptoMenu_onlySelected", onlySelected);
  }, [onlySelected]);

  useEffect(() => {
    saveToStorage("cryptoMenu_sortCriteria", sortCriteria);
  }, [sortCriteria]);

  useEffect(() => {
    saveToStorage("cryptoMenu_maxCoins", maxCoins);
  }, [maxCoins]);

  const sortedCryptos = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filteredCryptos = supportedCryptos.filter((crypto) => {
      const matchesSearch =
        crypto.name.toLowerCase().includes(lowerQuery) ||
        crypto.acronym.toLowerCase().includes(lowerQuery);
      return onlySelected
        ? matchesSearch &&
            selectedCryptos.some((el) => el.symbol === crypto.symbol)
        : matchesSearch;
    });

    const sorted = filteredCryptos.sort((a, b) => {
      const dataA = marketData[a.symbol] || {};
      const dataB = marketData[b.symbol] || {};
      switch (sortCriteria) {
        case "price":
          return parseFloat(dataB.price || 0) - parseFloat(dataA.price || 0);
        case "gain":
          return (
            parseFloat(dataB.priceChangePercent || 0) -
            parseFloat(dataA.priceChangePercent || 0)
          );
        case "loss":
          return (
            parseFloat(dataA.priceChangePercent || 0) -
            parseFloat(dataB.priceChangePercent || 0)
          );
        case "marketCap":
          return (
            parseFloat(dataB.price || 0) * (b.supply || 0) -
            parseFloat(dataA.price || 0) * (a.supply || 0)
          );
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return sorted;
  }, [
    supportedCryptos,
    searchQuery,
    onlySelected,
    selectedCryptos,
    marketData,
    sortCriteria,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    onlySelected,
    setOnlySelected,
    sortCriteria,
    setSortCriteria,
    maxCoins,
    setMaxCoins,
    sortedCryptos,
  };
}
