import { Router } from "express";
import { authenticate, authorize } from "../controllers/authControllers";
import { getCurrentOfficer } from "../controllers/officerControllers";

const router = Router();

router.use(authenticate);

router.use(authorize("officer"));

router.route("/me").get(getCurrentOfficer);

export default router;
