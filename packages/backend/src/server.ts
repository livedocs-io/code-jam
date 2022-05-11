import bodyParser from 'body-parser';
import cors from 'cors';
import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 8080; // default port to listen
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors({
    origin: 'http://localhost:3000'
}));

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    res.send("works")
} );

app.post("/", (req, res) => {
    // get the data from the request
    const auth = req.headers.apikey ?? null;
    if(auth){
        fetch('https://fakedaq-api.onrender.com/stock/AAPL', {
            method: 'GET',
            headers: {
                "api-key": auth as string
            }
        })
        .then((response) => response.json())
        .then((data) => {
          res.send(data)
        });
    }
})

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );