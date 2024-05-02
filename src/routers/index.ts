import { Router } from "express";

import authRouter from "./authRouter";
import userRouter from "./userRouter";
import officerRouter from "./officerRouter";
import vehicleRouter from "./vehicleRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/officers", officerRouter);
router.use("/vehicles", vehicleRouter);

export default router;
