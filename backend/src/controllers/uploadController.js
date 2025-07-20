const { uploadToCloudinary } = require("../services/cloudinaryService");

const uploadImage = async (req, res) => {
  try {
    console.log("Received request to upload image.");

    if (!req.file) {
      console.warn("No file found in request.");
      return res.status(400).json({ message: "No file uploaded." });
    }

    console.log("File found:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    console.log(
      "Image successfully uploaded to Cloudinary. URL:",
      result.secure_url
    );

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
};

module.exports = {
  uploadImage,
};
