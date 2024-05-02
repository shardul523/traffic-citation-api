import { Router } from "express";
import { authenticate } from "../controllers/authControllers";
import {
  getVehicleByPlate,
  registerNewVehicle,
} from "../controllers/vehicleControllers";

const router = Router();

router.use(authenticate);

router.post("/", registerNewVehicle);

router.route("/:licencePlate").get(getVehicleByPlate);

export default router;
