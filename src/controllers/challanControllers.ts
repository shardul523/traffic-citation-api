import path from "path";

import { py, pyModule } from "../config/py";
import {
  catchAsync,
  extractCharactersAfterPattern,
  getViolationFine,
  sanitizeNumberPlate,
} from "../utils";
import { prisma } from "../config/db";

/**
 * @description   Get vehicle number plate from image
 * @route         MIDDLEWARE
 * @access        private -> officer
 */
export const getVehiclePlate = catchAsync(async (req, res, next) => {
  const imagePath = path.join(
    __dirname,
    "..",
    "public",
    "images",
    req.file.filename
  );

  const result: any = await py.call(pyModule, "number_plate_reader", imagePath);

  //
  if (!result) return next(new Error("Number Plate could not be detected!"));

  req.body.licencePlate = sanitizeNumberPlate(
    extractCharactersAfterPattern(result, "Number Plate:")
  );

  req.body.image = path.join("images", req.file.filename);

  next();
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
    auth,
    image,
  }: {
    licencePlate: string;
    violation: string;
    auth: { officerId: string };
    image: string;
  } = req.body;

  if (!vehicleLicensePlate)
    return next(new Error("Vehicle Licence Plate must be specified"));

  if (!violation) return next(new Error("Violation should be specified"));

  // Calculate fine amount using violation
  const fineAmount = getViolationFine(violation);

  const newChallan = await prisma.challan.create({
    data: {
      vehicleLicensePlate,
      officerId: auth.officerId,
      fineAmount,
      violation,
      status: "ISSUED",
      image,
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Challan issued",
    challan: newChallan,
  });
});

/**
 * @description   Get challans of an officer
 * @route         GET /challans/officer/me
 * @access        private
 */
export const getOfficerChallans = catchAsync(async (req, res) => {
  const { auth } = req.body;
  const { officerId }: { officerId: string; role: string } = auth;
  const challans = await prisma.challan.findMany({ where: { officerId } });

  return res.status(200).json({
    status: "success",
    challans,
  });
});

/**
 * @description   Get challans of a user
 * @route         GET /challans/user/me
 * @access        private -> user
 */
export const getUserChallans = catchAsync(async (req, res) => {
  const { auth } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { vehicles: true },
  });

  const licencePlates = user.vehicles.map((vehicle) => vehicle.licencePlate);

  const challans = await prisma.challan.findMany({
    where: { vehicleLicensePlate: { in: licencePlates } },
  });

  return res.status(200).json({
    status: "success",
    challans,
  });
});

/**
 * @description   Get challan by id
 * @route         GET /challans/:challanId
 * @access        private
 */
export const getChallanById = catchAsync(async (req, res) => {
  const challanId = +req.params.challanId;

  const challan = await prisma.challan.findUnique({ where: { id: challanId } });

  return res.status(200).json({
    status: "success",
    challan,
  });
});

/**
 * @description   Update challan by id to paid
 * @route         PATCH /challans/:challanId
 * @access        private
 */
export const updateChallanToPaid = catchAsync(async (req, res) => {
  const challanId = +req.params.challanId;

  await prisma.challan.update({
    where: { id: challanId },
    data: { status: "PAID" },
  });

  res.status(200).json({
    status: "success",
    message: "Challan Paid",
  });
});

/**
 * @description   Delete challan by id
 * @route         DELETE /challans/:challanId
 * @access        admin
 */
export const deleteChallanById = catchAsync(async (req, res) => {
  const challanId = +req.params.challanId;

  await prisma.challan.delete({ where: { id: challanId } });

  return res.status(200).json({
    status: "success",
    message: "Challan deleted successfully",
  });
});
