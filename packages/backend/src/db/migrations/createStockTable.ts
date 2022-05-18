export const createStockTableQuery = `
    CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT,
    symbol TEXT,
    price NUMERIC,
    date TEXT
    );
    `;
