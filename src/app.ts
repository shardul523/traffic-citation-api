import express from "express";
import cookieParser from "cookie-parser";

import rootRouter from "./routers";
import { errorMiddleware } from "./controllers/errorController";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", rootRouter);
app.all("*", errorMiddleware);

export default app;
