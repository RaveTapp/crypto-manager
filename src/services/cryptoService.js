import { supportedCryptos } from "../supportedCryptos";

// export const fetchPricesForSymbols = async (symbols, setPrices) => {
//   try {
//     const newPrices = {};
//     for (const symbol of symbols) {
//       const response = await fetch(
//         `https://data-api.binance.vision/api/v3/ticker/price?symbol=${symbol}`
//       );
//       const data = await response.json();
//       newPrices[symbol] = parseFloat(data.price);
//     }
//     setPrices((prev) => ({ ...prev, ...newPrices }));
//   } catch (error) {
//     console.error("Error fetching prices:", error);
//   }
// };

export async function fetchMarketData(setMarketData, cryptos = supportedCryptos) {
  const promises = cryptos.map((crypto) =>
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${crypto.symbol}`)
      .then((res) => res.json())
      .catch(() => null)
  );
  const results = await Promise.all(promises);
  const dataMap = {};
  cryptos.forEach((crypto, index) => {
    dataMap[crypto.symbol] = {
      price: results[index].lastPrice,
      priceChangePercent: results[index].priceChangePercent,
    };
  });
  setMarketData(dataMap);
}
