import { Router } from "express";
import { authenticate, login, signup } from "../controllers/authControllers";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
