import { Router } from "express";

import {
  uploadVehicleImage,
  // sendVehicleNumberPlate,
  createNewChallan,
  deleteChallanById,
  getOfficerChallans,
  getUserChallans,
} from "../controllers/challanControllers";
import { authenticate, authorize } from "../controllers/authControllers";

const router = Router();

// router.post("/vehicle-image", sendVehicleNumberPlate);

router.use(authenticate);

router.route("/").post(authorize("officer"), createNewChallan);

router.get("/officer/me", authorize("officer"), getOfficerChallans);

router.get("/user/me", authorize("user"), getUserChallans);

router.route("/:challanId").delete(authorize("admin"), deleteChallanById);

export default router;
