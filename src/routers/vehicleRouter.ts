import { Router } from "express";
import { authenticate, authorize } from "../controllers/authControllers";
import {
  deleteVehicleByPlate,
  getVehicleByPlate,
  registerNewVehicle,
} from "../controllers/vehicleControllers";

const router = Router();

router.use(authenticate);

router.post("/", registerNewVehicle);

router
  .route("/:licencePlate")
  .get(getVehicleByPlate)
  .delete(authorize("admin"), deleteVehicleByPlate);

export default router;
