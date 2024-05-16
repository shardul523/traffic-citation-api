import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { RequestHandler } from "express";
import { catchAsync, sanitizeNumberPlate } from "../utils";

/**
 * @description     Register new vehicle
 * @route           POST /vehicles
 * @access          private
 */
export const registerNewVehicle = catchAsync(async (req, res, next) => {
  const { licencePlate, vehicleType }: Prisma.VehicleCreateInput = req.body;
  const { auth } = req.body;
  const { uid }: { uid: string } = auth;

  const validatedLicencePlate = sanitizeNumberPlate(licencePlate);
  if (!validatedLicencePlate) return next(new Error("Invalid license plate"));

  let vehicle = await prisma.vehicle.findUnique({
    where: { licencePlate: validatedLicencePlate },
  });

  if (!validatedLicencePlate) {
    vehicle = await prisma.vehicle.create({
      data: { licencePlate: validatedLicencePlate, uid, vehicleType },
    });
  } else {
    await prisma.vehicle.update({
      where: { licencePlate: validatedLicencePlate },
      data: { uid },
    });
  }

  return res.status(201).json({
    status: "success",
    vehicle,
  });
});

/**
 * @description     Get vehicle by license plate
 * @route           GET /vehicles/:licensePlate
 * @access          private
 */
export const getVehicleByPlate: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { licencePlate } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { licencePlate },
    });

    return res.status(200).json({
      status: "success",
      vehicle,
    });
  }
);

/**
 * @description   Delete registered vehicles
 * @route         DELETE /vehicles/:licencePlate
 * @access        admin
 */
export const deleteVehicleByPlate: RequestHandler = catchAsync(
  async (req, res) => {
    const { licencePlate } = req.params;

    await prisma.vehicle.delete({
      where: { licencePlate },
    });

    return res.status(204).json({
      status: "success",
      message: "Vehicle deleted successfully",
    });
  }
);

/**
 * @description   Register vehicle if it does not exist
 * @route         MIDDLEWARE
 * @access        private -> officer
 */
export const registerVehicleIfAbsent = catchAsync(async (req, res, next) => {
  const { licencePlate, vehicleType }: Prisma.VehicleCreateInput = req.body;

  const vehicle = await prisma.vehicle.findUnique({ where: { licencePlate } });

  if (vehicle) return next();

  await prisma.vehicle.create({
    data: { licencePlate, vehicleType },
  });

  next();
});
