import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

import rootRouter from "./routers";
import { errorMiddleware } from "./controllers/errorController";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", rootRouter);
app.use(errorMiddleware);

export default app;
