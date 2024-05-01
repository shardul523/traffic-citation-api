import path from "path";
import multer from "multer";

import { py, pyModule } from "../config/py";
import { catchAsync, extractCharactersAfterPattern } from "../utils";

const upload = multer();

export const uploadVehicleImage = upload.single("vehicle-image");

export const sendVehicleNumberPlate = catchAsync(async (req, res) => {
  const result: any = await py.call(
    pyModule,
    "number_plate_reader",
    path.join(__dirname, "..", "data/images", "car.jpg")
  );

  res.send(extractCharactersAfterPattern(result, "Number Plate:"));
});

/**
 * @description   Generate new challan
 * @route         POST /challans
 * @access        private -> officer
 */
export const createNewChallan = catchAsync(async (req, res) => {});

/**
 * @description   Get challans of a vehicle
 * @route         GET /challans
 * @access        private -> officer
 */
export const getVehicleChallans = catchAsync(async (req, res) => {});

/**
 * @description   Get challans of a user
 * @route         GET /challans/me
 * @access        private -> user
 */
export const getUserChallans = catchAsync(async (req, res) => {});

/**
 * @description   Get challan by id
 * @route         GET /challans/:challanId
 * @access        private
 */
export const getChallanById = catchAsync(async (req, res) => {});

/**
 * @description   Update challan by id to paid
 * @route         PATCH /challans/:challanId
 * @access        private
 */
export const updateChallanToPaid = catchAsync(async (req, res) => {});
