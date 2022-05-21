export const QUERIES = [
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        date TEXT,
        rate_limit NUMBER
    )`,
    `CREATE TABLE IF NOT EXISTS records (
        fusionid TEXT NOT NULL,
        date TEXT NOT NULL,
        value DOUBLE,
        PRIMARY KEY (fusionid, date)
    )`
];
    /**
     * all we need is the latest data for the day. Let's store that only.
     * 
     * api-key -> stock-name -> date -> value
     * 
     */