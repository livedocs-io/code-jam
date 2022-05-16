import cors from "cors";
import express, { urlencoded, json } from "express";
import fetch from "node-fetch";
import sqlite3 from "sqlite3";
import { createUserTableQuery, PriceDetails } from "./queries";

const app = express();
const port = process.env.PORT || 4000;

// we presume this is updated once a day via cron rather than here

let stockPrices = new Map<string, PriceDetails>([
  ["LDOCS", new PriceDetails({
      name:"Livedocs",
      prices:[],
      queriedToday:0
    })],
  ["APPL", new PriceDetails({
      name:"Apple",
      prices:[],
      queriedToday:0
    })],
  ["GOOGL", new PriceDetails({
      name:"Alphabet",
      prices:[],
      queriedToday:0
    })],
  ["MSFT", new PriceDetails({
      name:"Microsoft",
      prices:[],
      queriedToday:0
    })],
  ["TSLA", new PriceDetails({
      name:"Tesla",
      prices:[],
      queriedToday:0
    })],
  ["AMZN", new PriceDetails({
      name:"Amazon",
      prices:[],
      queriedToday:0
    })],
]);


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
    );
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

// api for user to get stock prices from local data
app.get('/user/:stock/:date', (req, res) => {
  const auth = req.headers["apikey"] ?? null;
  if (auth) {
    let s = req.params["stock"]
    let d = req.params["date"]
    res.send(stockPrices.get(s))
  } else {
    res.send({'Error':'Unauthorized!'})
  }
})


// get the stock data from fakedaq
app.post("/:stock/:date", (req, res) => {
  const auth = req.headers["apikey"] ?? null;
  if (auth) {
    let s = req.params["stock"]
    let d = req.params["date"]
    fetch("https://fakedaq-api.onrender.com/stock/"+s, {
      method: "GET",
      headers: {
        "api-key": auth as string,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.send(data);
      });
  } else {
    res.send({'Error':'Unauthorized!'})
  }
});

// Dummy endpoint so we dont exceed limiter rate
app.post("/dummy/:stock/:date", (req, res) => {
  const auth = req.headers["apikey"] ?? null;
  if (auth) {
    let s = req.params["stock"]
    let d = req.params["date"]
    let p = (Math.floor(Math.random() * 100) + 1)

    var priceObj = stockPrices.get(s)
    priceObj.prices.push({'name':d,'uv':p})
    priceObj.queriedToday += 1
    if (priceObj.queriedToday < 10)
      stockPrices.set(s, priceObj)
    
    res.send(priceObj.prices)
  } else {
    res.send({'Error':'Unauthorized!'})
  }
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

