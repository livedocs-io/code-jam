import { StockPrice } from "../types";


export const fetchStockPrice = async (apiKey: string, date: Date): Promise<StockPrice> => {
  const response = await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      ApiKey: `${apiKey}`,
    },
    body: JSON.stringify({ date }),
  });
  const data = await response.json();

  console.log("ok");
  console.log(data);

  return data;
};
