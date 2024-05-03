import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { RequestHandler } from "express";

/**
 * @description     Register new vehicle
 * @route           POST /vehicles
 * @access          private
 */
export const registerNewVehicle = async (req, res, next) => {
  const { licencePlate, vehicleType }: Prisma.VehicleCreateInput = req.body;

  if (!licencePlate || licencePlate.length !== 10)
    return next(new Error("Invalid license plate"));

  try {
    const newVehicle = await prisma.vehicle.create({
      data: { licencePlate, userId: req.body.userId, vehicleType },
    });

    return res.status(201).json({
      status: "success",
      vehicle: newVehicle,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * @description     Get vehicle by license plate
 * @route           GET /vehicles/:licensePlate
 * @access          private
 */
export const getVehicleByPlate: RequestHandler = async (req, res, next) => {
  const { licencePlate } = req.params;

  if (licencePlate.length !== 10)
    return next(new Error("Invalid license plate"));

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { licencePlate },
    });

    return res.status(200).json({
      status: "success",
      vehicle,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * @description   Delete registered vehicles
 * @route         DELETE /vehicles/:licencePlate
 * @access        admin
 */
export const deleteVehicleByPlate: RequestHandler = async (req, res, next) => {
  const { licencePlate } = req.params;

  try {
    await prisma.vehicle.delete({
      where: { licencePlate },
    });

    return res.status(204).json({
      status: "success",
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
