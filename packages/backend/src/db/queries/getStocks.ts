export function getMostRecentStocks(userId: string): string {
    return `SELECT * FROM stock WHERE user_id = "${userId}";`;
}
