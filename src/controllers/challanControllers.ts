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
