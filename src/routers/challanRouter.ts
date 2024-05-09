import { Router } from "express";

import {
  uploadVehicleImage,
  sendVehicleNumberPlate,
  createNewChallan,
} from "../controllers/challanControllers";
import { authenticate, authorize } from "../controllers/authControllers";

const router = Router();

router.post("/vehicle-image", sendVehicleNumberPlate);

router.use(authenticate);

router.use(authorize("officer"));

router.route("/").post(createNewChallan);

export default router;
