import express from "express";
import cookieParser from "cookie-parser";

import rootRouter from "./routers";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", rootRouter);

export default app;
