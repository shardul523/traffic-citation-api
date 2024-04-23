import { Router } from "express";
import { authenticate } from "../controllers/authControllers";
import { getCurrentUser } from "../controllers/userControllers";

const router = Router();

router.route("/me").get(authenticate, getCurrentUser);

export default router;
