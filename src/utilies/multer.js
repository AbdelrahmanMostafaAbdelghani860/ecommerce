import multer, { diskStorage } from "multer";

export const filterObject = {
  image: ["image/png", "image/jpeg"],
  file: ["application/pdf ", "application/msword"],
  video: ["video/mp4"],
};
export const fileUpload = (filterArray) => {
  const fileFilter = (req, file, cb) => {
    if (!filterArray.includes(file.mimetype)) {
      return cb(new Error("Invalid Format!"), false);
    }
    return cb(null, true);
  };

  return multer({ storage: diskStorage({}), fileFilter });
};
