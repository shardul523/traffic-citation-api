import { Router } from "express";
import { authenticate } from "../controllers/authControllers";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userControllers";

const router = Router();

router.use(authenticate);
router.route("/me").get(getCurrentUser).patch(updateCurrentUser);

export default router;
