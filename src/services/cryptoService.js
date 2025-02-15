export const fetchPricesForSymbols = async (symbols, setPrices) => {
    try {
        const newPrices = {};
        for (const symbol of symbols) {
            const response = await fetch(`https://data-api.binance.vision/api/v3/ticker/price?symbol=${symbol}`);
            const data = await response.json();
            newPrices[symbol] = parseFloat(data.price);
        }
        setPrices((prev) => ({ ...prev, ...newPrices }));
    } catch (error) {
        console.error("Error fetching prices:", error);
    }
};
