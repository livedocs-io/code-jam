export function createStockForUser(
  userId: string,
  name: string,
  symbol: string,
  price: number,
  currDate: string
): string {
  return `INSERT INTO stock (user_id, name, symbol, price, date) VALUES ("${userId}", "${name}", "${symbol}", ${price}, "${currDate}");`;
}
