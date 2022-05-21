import fetch from "node-fetch";
import { Request, Response } from "express";
import NodeCache from "node-cache";

import db from "../db/init";
import { createNewSessionForUser } from "../db/queries/createNewSession";
import { createNewUser } from "../db/queries/createUser";
import { createStockForUser } from "../db/queries/createStock";
import { getMostRecentStocks } from "../db/queries/getStocks";

const userCache = new NodeCache();

const API_URL = "https://fakedaq-api.onrender.com/stock/AAPL";
const API_URL_HTTP_METHOD = "GET";

/**
 * Create a new user profile or create a new session for an existing user.
 * @param req - header with API key
 * @param res - response object to return to the requesting entity
 * @returns
 */
export async function createUser(req: Request, res: Response): Promise<void> {
  const auth = req.headers.api_key ?? null;

  const currDate = new Date().toISOString();

  if (auth) {
    if (userCache.get(auth as string)) {
      db.run(createNewSessionForUser(auth as string, currDate), (err) => {
        if (err) {
          console.log(err);

          res.status(500).send();
        } else {
          userCache.set(auth as string, 9);

          res.status(200).send();
        }
      });
    } else {
      db.run(createNewUser(auth as string, currDate), (err) => {
        if (err) {
          console.log(err);

          res.status(500).send();
        } else {
          userCache.set(auth as string, 9);

          res.status(200).send();
        }
      });
    }
  }
}

/**
 * Get the stocks belonging to the user profile.
 * @param req - header with API key and body including date
 * @param res - response object to return to the requesting entity
 * @returns
 */
export async function getStocksFromUser(
  req: Request,
  res: Response
): Promise<void> {
  const auth = req.headers.api_key ?? null;

  const { date } = req.body;
  const currRateLimit: number = userCache.get(auth as string);

  if (auth) {
    if (currRateLimit) {
      db.all(getMostRecentStocks(auth as string), (err, data) => {
        if (err) {
          console.log(err);

          res.status(500).send();
        } else {
          res.status(200).json(data);
        }
      });
    } else {
      if (currRateLimit < 1) {
        res.status(500).send();
      } else {
        await fetch(API_URL, {
          method: API_URL_HTTP_METHOD,
          headers: {
            "api-key": auth as string,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            userCache.set(auth as string, {
              rateLimit: currRateLimit - 1,
            });

            const { name, symbol, price } = data;

            db.run(
              createStockForUser(auth as string, name, symbol, price, date),
              (err) => {
                if (err) {
                  console.log(err);

                  res.status(500).send();
                }
              }
            );

            res.status(200).json(data);
          });
      }
    }
  }
}
