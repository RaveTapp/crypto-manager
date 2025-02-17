import { supportedCryptos } from "../supportedCryptos";

export async function fetchMarketData(cryptos, setMarketData) {
  if (Array.isArray(cryptos)) {
    const promises = cryptos.map((crypto) =>
      fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${crypto.symbol}`
      )
        .then((res) => res.json())
        .catch(() => null)
    );
    const results = await Promise.all(promises);
    const dataMap = {};
    cryptos.forEach((crypto, index) => {
      const result = results[index];
      if (result) {
        dataMap[crypto.symbol] = {
          price: result.lastPrice,
          priceChangePercent: result.priceChangePercent,
        };
      }
    });
    setMarketData(dataMap);
  }
}
