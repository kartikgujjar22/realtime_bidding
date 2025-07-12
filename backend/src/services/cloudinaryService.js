const cloudinary = require("cloudinary").v2; // Import Cloudinary SDK
const dotenv = require("dotenv"); // For loading environment variables
const path = require("path"); // For resolving file paths

// Load environment variables from the .env file in the backend root directory.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Configure Cloudinary using credentials from environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS for all requests
});

/**
 * Uploads a file (image) to Cloudinary.
 *
 * @param {string} filePath - The local path to the file to be uploaded (e.g., from Multer's req.file.path).
 * @param {string} folder - The folder name within Cloudinary to store the image (e.g., 'realtime_bidding-products').
 * @returns {Promise<object>} A Promise that resolves with the Cloudinary upload result,
 * which includes the secure URL of the uploaded image.
 */
const uploadImageToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "image",
    });
    console.log(`Cloudinary upload successful: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error.message);
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

module.exports = { uploadImageToCloudinary, cloudinary };
