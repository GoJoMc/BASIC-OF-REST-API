import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";

dotenv.config();

import router from "./router/router.js";

const app = express();

app.use(
  cors({
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("server is running on http://localhost:8080");
});

const MONGO_URL = process.env["MONGO_URL"];

if (!MONGO_URL) {
  throw new Error("Where is The Mongo Url");
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
