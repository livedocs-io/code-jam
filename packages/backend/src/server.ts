import cors from "cors";
import express, { urlencoded, json } from "express";
import fetch from "node-fetch";
import sqlite3 from "sqlite3";
import { createUserTableQuery } from "./queries";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
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

app.post("/", (req, res) => {
  // get the data from the request
  const auth = req.headers.apikey ?? null;
  if (auth) {
    fetch("https://fakedaq-api.onrender.com/stock/AAPL", {
      method: "GET",
      headers: {
        "api-key": auth as string,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.send(data);
      });
  }
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
