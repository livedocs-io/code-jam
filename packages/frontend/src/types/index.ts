export type StockPrice = {
  name: string;
  symbol: string;
  price: number;
};

export type StockPriceMap = {
  [time: string]: StockPrice;
};
