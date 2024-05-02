import { Router } from "express";
import { authenticate, authorizeOfficer } from "../controllers/authControllers";
import { getCurrentOfficer } from "../controllers/officerControllers";

const router = Router();

router.use(authenticate);

router.use(authorizeOfficer);

router.route("/me").get(getCurrentOfficer);

export default router;
