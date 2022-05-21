import fetch from "node-fetch";

const baseUrl = "https://fakedaq-api.onrender.com/stock/";

export const getStockPrice = function (apiKey: any, stockId = "AAPL") {
  const url = `${baseUrl}${stockId}`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "api-key": apiKey as string,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default {
    getStockPrice
}