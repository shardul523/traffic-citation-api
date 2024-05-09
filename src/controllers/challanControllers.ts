import path from "path";
import multer from "multer";

import { py, pyModule } from "../config/py";
import {
  catchAsync,
  extractCharactersAfterPattern,
  getViolationFine,
} from "../utils";
import { prisma } from "../config/db";

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
export const createNewChallan = catchAsync(async (req, res, next) => {
  const {
    licencePlate: vehicleLicensePlate,
    violation,
  }: { licencePlate: string; violation: string } = req.body;

  if (!vehicleLicensePlate)
    return next(new Error("Vehicle Licence Plate must be specified"));

  if (!violation) return next(new Error("Violation should be specified"));

  const officer = await prisma.officer.findUnique({
    where: { id: req.body.officerId },
  });

  // Calculate fine amount using violation
  const fineAmount = getViolationFine(violation);

  const newChallan = await prisma.challan.create({
    data: {
      vehicleLicensePlate,
      officerId: officer.officerId,
      fineAmount,
      violation,
      status: "ISSUED",
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Challan issued",
    challan: newChallan,
  });
});

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
