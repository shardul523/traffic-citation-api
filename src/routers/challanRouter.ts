import { Router } from "express";

import {
  uploadVehicleImage,
  // sendVehicleNumberPlate,
  createNewChallan,
  deleteChallanById,
} from "../controllers/challanControllers";
import { authenticate, authorize } from "../controllers/authControllers";

const router = Router();

// router.post("/vehicle-image", sendVehicleNumberPlate);

router.use(authenticate);

router.route("/").post(authorize("officer"), createNewChallan);

router.route("/:challanId").delete(authorize("admin"), deleteChallanById);

export default router;
