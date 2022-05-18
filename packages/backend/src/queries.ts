export const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    date TEXT)
    `;

export const createStockTableQuery = `
    CREATE TABLE IF NOT EXISTS stocks (
    symbol TEXT,
    name TEXT,
    date TEXT,
    price FLOAT(32))
    `;

export class PriceObj {
    date:Date
    name:string // for chart widget to display date 
    uv:number
    public constructor(init?:Partial<PriceObj>) {
        Object.assign(this, init);
    }
}

export class PriceDetails {
    name:string
    prices:PriceObj[]
    queriedToday:number
    public constructor(init?:Partial<PriceDetails>) {
        Object.assign(this, init);
    }
}
