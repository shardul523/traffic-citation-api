import path from "path";
import multer from "multer";

// import { py, pyModule } from "../config/py";
import {
  catchAsync,
  extractCharactersAfterPattern,
  getViolationFine,
} from "../utils";
import { prisma } from "../config/db";

const upload = multer();

export const uploadVehicleImage = upload.single("vehicle-image");

// export const sendVehicleNumberPlate = catchAsync(async (req, res) => {
//   const result: any = await py.call(
//     pyModule,
//     "number_plate_reader",
//     path.join(__dirname, "..", "data/images", "car.jpg")
//   );

//   res.send(extractCharactersAfterPattern(result, "Number Plate:"));
// });

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
  }: {
    licencePlate: string;
    violation: string;
    auth: { officerId: string };
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
export const getChallanById = catchAsync(async (req, res) => {});

/**
 * @description   Update challan by id to paid
 * @route         PATCH /challans/:challanId
 * @access        private
 */
export const updateChallanToPaid = catchAsync(async (req, res) => {});

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
