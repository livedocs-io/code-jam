import sqlite3 from "sqlite3";

import { QUERIES } from "../helpers/queries";
import { ERRORS } from "../helpers/constants";

const sqlite = sqlite3.verbose();
const db = new sqlite.Database("./livedocs.db", (err) => {
    if (err) {
      console.log("Failed to connect to the database");
    } else {
      console.log("Connected to the database");
    }
});

function setup() {
  console.log('setting up db...')
  QUERIES.forEach((query) => {
      db.run(query, (err) => {
          if(err) {
            console.log(ERRORS['setupdb'], err);
          }
      })
  })
}
setup();

export default db;