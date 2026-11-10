import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import compression from "compression";
import cookieParser from "cookie-parser";

import authenticationRouter from "./router/authencation.router.js";
import userRouter from "./router/users.router.js";
import { env } from "./config/env.js";
import { requireAuth } from "./middlewares/middleware.js";

const app = express();

app.use(
  cors({
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());

mongoose.connect(env.MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/api/auth", authenticationRouter);
app.use("/api/me", requireAuth, userRouter);

app.listen(env.PORT, () => {
  console.log("running on http://localhost:8080");
});
