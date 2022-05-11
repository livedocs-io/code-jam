"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const app = (0, express_1.default)();
const port = 8080; // default port to listen
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000'
}));
// define a route handler for the default home page
app.get("/", (req, res) => {
    // render the index template
    res.send("works");
});
app.post("/", (req, res) => {
    var _a;
    // get the data from the request
    const auth = (_a = req.headers.apikey) !== null && _a !== void 0 ? _a : null;
    if (auth) {
        (0, node_fetch_1.default)('https://fakedaq-api.onrender.com/stock/AAPL', {
            method: 'GET',
            headers: {
                "api-key": auth
            }
        })
            .then((response) => response.json())
            .then((data) => {
            res.send(data);
        });
    }
});
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map