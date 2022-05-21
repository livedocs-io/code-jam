export const QUERIES = [
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        date TEXT,
        requests TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS records (
        fusionid TEXT PRIMARY KEY,
        date DATE,
        value TEXT
    )`
];
    /**
     * all we need is the latest data for the day. Let's store that only.
     * 
     * api-key -> stock-name -> date -> value
     * 
     */