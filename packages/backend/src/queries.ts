export const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    date TEXT)
    `;


class PriceObj {
    name:string
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
