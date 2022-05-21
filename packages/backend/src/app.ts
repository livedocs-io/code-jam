import cors from "cors";
import express, { urlencoded, json } from "express";

import userRouter from "./routes/userRouter";

const app = express();

// const origins = [/http:\/\/localhost:\d\d\d\d/];
const origins = ["http://localhost:3000"];

app.use(cors({ origin: origins }));
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(userRouter);

export default app;
