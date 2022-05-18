import sqlite3 from "sqlite3";

import { createUserTableQuery } from './migrations/createUserTable';
import { createStockTableQuery } from './migrations/createStockTable';

const sqlite = sqlite3.verbose();

const db = new sqlite.Database("./livedocs.sqlite3", (err) => {
  if (err) {
    console.log("Failed to connect to the database");
  } else {
    console.log("Connected to the database");
  }
});

db.run(createUserTableQuery);
db.run(createStockTableQuery);

export default db;
