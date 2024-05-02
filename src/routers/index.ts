import { Router } from "express";

import authRouter from "./authRouter";
import userRouter from "./userRouter";
import officerRouter from "./officerRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/officers", officerRouter);

export default router;
