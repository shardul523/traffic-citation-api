import { Router } from "express";
import { authenticate, authorize } from "../controllers/authControllers";
import {
  deleteUserById,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userControllers";

const router = Router();

router.use(authenticate);

router.route("/me").get(getCurrentUser).patch(updateCurrentUser);

router.use(authorize("admin"));

router.route("/:userId").delete(deleteUserById);

export default router;
