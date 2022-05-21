import cors from "cors";
import express, { urlencoded, json, response } from "express";
// import sqlite3 from "sqlite3";

import db from './setup.db';
import api from '../helpers/api';
import utils from '../helpers/utils';
import { ERRORS } from "../helpers/constants";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(urlencoded({ extended: false }));
app.use(json());
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`)
  next();
})

// define a route handler for the default home page
app.get("/", (req, res) => {
  db.all("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// accepts date in body parameter
app.post("/", async (req, res) => {

  const auth: string = req.headers.apikey.toString() ?? null;
  let date = req.body.date || new Date();
  date = new Date(date).toISOString();
  const stockId = "AAPL";
  if (auth) {
    // creates a user, if not created.
    utils.createUser(db, auth)
    .catch(err => {});

    utils.constructResonse(db, auth, stockId, date)
      .then(data => {
        utils.getUser(db, auth)
        .then((user: User) => {
          res.json({
            rate_limit: user.rate_limit,
            data: data
          })
        })
      })
      .catch((err) => {
        console.log("Someghing went wrong...", err)
      });
  }
});

app.post("/refresh", (req, res) => {
  const auth = req.headers.apikey.toString() ?? null;
  const stockId = "AAPL";
  let date = req.body.date || new Date();
  date = new Date(date).toISOString().split("T")[0];
  const currentDate = new Date().toISOString().split("T")[0];

  if (auth) {
    utils.getUser(db, auth).then((user: User) => {
      console.log(auth, currentDate, user);

      if((user.date == currentDate && user.rate_limit > 0) || (user.date != currentDate)){
        api.getStockPrice(auth, stockId)
          .then(async (data: ApiResp) => {
            //  update the db records...
            console.log(data)
            await utils.updateRecords(db, auth, stockId, currentDate, data.price);

            // generate the updated response from the database

            // optimization: 
            // cache the initially created response on the user id and date and use it
            // for the refresh request.
            // hence, reducing 1 db call/request

            utils.constructResonse(db, auth, stockId, date)
              .then((response) => {
                //  format the response
                //  { name: date, uv: value || 0(default) }
                res.json({
                  rate_limit: user.rate_limit - 1,
                  data: response
                })
              })
              .catch((err) => {
                console.log("Somegthing went wrong...", err)
              });

            // here, update it's rate limit and current date to keep track of dailt request limits
            utils.updateUser(db, user);
          })
          .catch((err) => {
            console.log(ERRORS['request_error'], err)
          })
      } else {
        utils.constructResonse(db, auth, stockId, date)
          .then((response) => {
            //  format the response
            //  { name: date, uv: value || 0(default) }
            res.json({
              rate_limit: user.rate_limit,
              data: response
            })
          })
          .catch((err) => {
            console.log("Someghing went wrong...", err)
          });
      }
    });
  }
})

// this endpoint to be used only to flood the db with fake entries...
app.post("/flood", (req, res) => {
  const auth = req.headers.apikey.toString() ?? null;
  const date = new Date().toISOString();
  utils.floodDb(auth, date, "AAPL");
  res.send("Consider it done\n");
});

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});


interface ApiResp {
  name: string,
  symbol: string,
  price: number
}

interface User {
  id: string,
  date: string,
  rate_limit: number
}