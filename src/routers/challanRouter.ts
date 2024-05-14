import { Router } from "express";

import {
  // sendVehicleNumberPlate,
  createNewChallan,
  deleteChallanById,
  getChallanById,
  getOfficerChallans,
  getUserChallans,
  sendVehicleDetails,
  updateChallanToPaid,
} from "../controllers/challanControllers";
import { authenticate, authorize } from "../controllers/authControllers";
import { uploadVehicleImage } from "../utils/multer";

const router = Router();

// router.post("/vehicle-image", sendVehicleNumberPlate);

router.post("/upload/vehicle-image", uploadVehicleImage, sendVehicleDetails);

router.use(authenticate);

router
  .route("/")
  .post(authorize("officer"), uploadVehicleImage, createNewChallan);

router.get("/officer/me", authorize("officer"), getOfficerChallans);

router.get("/user/me", authorize("user"), getUserChallans);

router
  .route("/:challanId")
  .get(getChallanById)
  .delete(authorize("admin"), deleteChallanById);

router.patch("/:challanId/pay", updateChallanToPaid);

export default router;
