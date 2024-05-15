import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const dataFolder = path.join(__dirname, "..", "public", "images");
    callback(null, dataFolder);
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").at(-1);
    callback(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

const upload = multer({ storage });

export const uploadVehicleImage = upload.single("vehicle-image");
