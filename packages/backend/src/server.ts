import cors from "cors";
import express, { urlencoded, json } from "express";
import fetch from "node-fetch";
import sqlite3 from "sqlite3";
import { createUserTableQuery, createQuotesTableQuery } from "./queries";

const app = express();
const port = process.env.PORT || 4000;

// date helper functions to work with single dates without time
const dateOnlyString = (date: Date) => dateOnlyAsTimeStamp(date).toString();
const dateOnlyAsTimeStamp = (date: Date) => date.setHours(0, 0, 0, 0);
const dateMinusDays = (date: Date, days: number) => date.setHours(0, 0, 0, 0) - (1000 * 60 * 60 * 24 * days);
const createDateRange = (days: number) => [...Array(days).keys()].reverse().map((d) => dateMinusDays(new Date(), d).toString())

// quick hack to fill missing data points (probably could be more efficient as it is now O(N)=N*N due to the filter, probalby convert to an hash and use O(n))
const fillEmptyDataPoints = (values: any[], timeStamps: string[]) =>
  timeStamps.map((date) => values.filter((quote) => quote.date === date)[0] ?? { value: null, date: date })

app.use(
  cors({
    origin: "*",
  })
);
app.use(urlencoded({ extended: false }));
app.use(json());

// initialize new sqlite database
const sqlite = sqlite3.verbose();
const db = new sqlite.Database("", (err) => {
  if (err) {
    console.log("Failed to connect to the database");
  } else {
    console.log("Connected to the database");
  }
});

// Async wrapper for sqlite `all` method
const asyncAll = <T>(db: sqlite3.Database, sql: string, params: any[]): Promise<T[]> =>
  new Promise(function (resolve, reject) {
    db.all(sql, params, function (error, rows) {
      if (error)
        reject(error);
      else
        resolve(rows);
    });
  });


// create user table
db.run(createUserTableQuery, (err) => {
  if (err) {
    console.log(err);
  } else {
    // insert test data
    db.run(
      `INSERT INTO users (id, date)
        VALUES (?, ?)`,
      ["test-id", new Date().toISOString()]
    )
  }
});

// create quotes table
db.run(createQuotesTableQuery, (err) => {
  if (err) {
    console.log(err);
  }
});

// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.send("works");
  // read test value from database
  db.get("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

app.post("/:ticker", async (req, res) => {
  const auth = req.headers.apikey;
  if (!auth) {
    res.status(401).send({ "error": "Missing API Key" })
    return
  }

  // Check also if valid ticker from list
  const ticker = req.params.ticker
  if (!ticker) {
    res.status(500).send({ "error": "Not a valid ticker" })
    return
  }

  try {
    let failed = false
    // First see if we have a result for today already
    const todayResult = await asyncAll(db, "SELECT * FROM quotes where date = ? AND ticker = ?", [dateOnlyString(new Date()), ticker])

    // If not, or we want to force it, then fetch from api 
    // (checking for `true` in `force` param ignoring case so `True` would result in not forcing it)
    if (todayResult.length === 0 || req.query.force === 'true') {
      const response = await fetch(`https://fakedaq-api.onrender.com/stock/${req.params.ticker}`, {
        method: "GET",
        headers: {
          "api-key": auth as string,
        },
      })

      if (response.ok) {
        const data = await response.json()
        db.run(
          `INSERT OR REPLACE INTO quotes (ticker, value, date) VALUES (?, ?, ?)`,
          // [req.params.ticker, data.price, [dateOnlyString(new Date())]]
          [ticker, data.price, dateOnlyString(new Date())]
        );
      }
      else {
        failed = true
        // We probably want to log the error here, BUT not return an error to the client since we are returning the last ok value
      }
    }

    // Set a 7 day limit, and fill in the blanks
    const results = await asyncAll(db, "SELECT * FROM quotes WHERE ticker = ? ORDER BY date DESC LIMIT 7", [ticker])
    if (results.length === 0 && failed) {
      res.status(500).send({ "error": "Failed to fetch quotes from server" });
    }
    else {
      const filledResults = fillEmptyDataPoints(results, createDateRange(7))
      res.send(filledResults);
    }
  }
  catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
});


// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
