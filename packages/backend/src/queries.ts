export const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    date TEXT)
    `;

export const createQuotesTableQuery = `
    CREATE TABLE IF NOT EXISTS quotes (
    ticker TEXT ,
    value INT,
    date TEXT,
    PRIMARY KEY (ticker, date))
    `;
