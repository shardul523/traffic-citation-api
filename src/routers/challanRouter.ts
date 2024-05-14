import { Router } from "express";

import {
  // sendVehicleNumberPlate,
  createNewChallan,
  deleteChallanById,
  getChallanById,
  getOfficerChallans,
  getUserChallans,
  getVehiclePlate,
  updateChallanToPaid,
} from "../controllers/challanControllers";
import { authenticate, authorize } from "../controllers/authControllers";
import { uploadVehicleImage } from "../utils/multer";
import { registerVehicleIfAbsent } from "../controllers/vehicleControllers";

const router = Router();

router
  .route("/")
  .post(
    uploadVehicleImage,
    authenticate,
    authorize("officer"),
    getVehiclePlate,
    registerVehicleIfAbsent,
    createNewChallan
  );

router.use(authenticate);

router.get("/officer/me", authorize("officer"), getOfficerChallans);

router.get("/user/me", authorize("user"), getUserChallans);

router
  .route("/:challanId")
  .get(getChallanById)
  .delete(authorize("admin"), deleteChallanById);

router.patch("/:challanId/pay", updateChallanToPaid);

export default router;
