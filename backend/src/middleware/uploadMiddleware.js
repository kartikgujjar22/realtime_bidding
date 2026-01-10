const multer = require("multer");
const path = require("path");
const logger = require("../../logger");
const { machine } = require("os");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;

    // Check Extension
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    logger.info(`this is the image type upload by the user : ${extName}`);
    // Check Mime Type
    const mimeType = fileTypes.test(file.mimetype);
    logger.info(`Now checking the MIME type of the image ${mimeType}`);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."));
    }
  },
});

const uploadImage = (req, res, next) => {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        logger.error("Uploaded file is too large");
        return res.status(400).json({
          message: `File too large. Max limit is 5MB.`,
        });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        logger.error("Unexpected file type");
        return res.status(400).json({
          message:
            "Too many files or wrong field name. Ensure field is named 'image'.",
        });
      }
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = { uploadImage };
