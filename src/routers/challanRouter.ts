import { Router } from "express";

import {uploadVehicleImage, sendVehicleNumberPlate} from '../controllers/challanControllers'

const router = Router();

router.post('/vehicle-image', sendVehicleNumberPlate)

export default router