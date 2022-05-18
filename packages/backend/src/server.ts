import cors from "cors";
import express, { urlencoded, json } from "express";
import fetch from "node-fetch";
import sqlite3 from "sqlite3";
import { createUserTableQuery, createStockTableQuery, PriceDetails, PriceObj } from "./queries";

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
    console.log(err)
  } else {
    // insert test data
    db.run(
      `INSERT INTO users (id, date)
        VALUES (?, ?)`,
      ["test-id", new Date().toISOString()]
    );
  }
});

// create stock table
db.run(createStockTableQuery, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Stock table created =)")
  }
});

function InsertStock(sSymbol:string, sName:string, sDate:Date, sPrice:number) {
  db.all(`INSERT INTO stocks (symbol, name, date, price)
    VALUES (?, ?, ?, ?)`,
    [sSymbol, sName, sDate, sPrice], 
    (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        console.log("Stock "+sSymbol+" inserted.")
      }
  })
}

function UpdateStock(sSymbol:string, sDate:Date, sPrice:number) {
  db.all(`UPDATE stocks SET date=?, price=?
    WHERE symbol=?`,
    [sDate, sPrice, sSymbol], 
    (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        console.log("Stock updated for "+sSymbol)
      }
  })
}


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

app.get("/allStocks", (req, res) => {
  db.all(`SELECT * FROM stocks`, (err, rows) => {
    if (err) {
      console.log(err)
      res.send({'Result':'Error getting from DB!'})
    } else {
      res.send({'Result':rows})
    }
  })
});


// get the stock data from fakedaq
app.post("/:stock/:date", (req, res) => {
  const auth = req.headers["apikey"] ?? null;
  if (auth) {
    let s = req.params["stock"]
    let d = req.params["date"]
    let ddate = new Date(d)
    let dgraph = d.substring(4)
    let priceObj = stockPrices.get(s)

    if (priceObj.queriedToday < 10) {
      fetch("https://fakedaq-api.onrender.com/stock/"+s, {
        method: "GET",
        headers: {
          "api-key": auth as string,
        },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.hasOwnProperty('price')) {
          let dindex = priceObj.prices.map(function(e) { return e.name; }).indexOf(dgraph)
          let p = data['price']

          if (dindex == -1) {
            priceObj.prices.push(new PriceObj({'date':ddate, 'name':dgraph,'uv':p}))
            priceObj.prices.sort((a, b) => {
              return a.date.getTime() - b.date.getTime() // ok not the most efficient... 
            })
            InsertStock(s, priceObj.name, ddate, p)
          } else {
            priceObj.prices[dindex].uv = p
            UpdateStock(s, ddate, p)
          }

          priceObj.queriedToday += 1
          stockPrices.set(s, priceObj)
        } else {
          console.log("Stock API limit exceeded!")
        }
      })
    }
    res.send(priceObj.prices)
  } else {
    res.send({'Error':'Unauthorized!'})
  }
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

