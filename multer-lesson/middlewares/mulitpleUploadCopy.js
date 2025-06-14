const fs = require("fs");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

const uploadMultiple = asyncHandler(async (req, res, next) => {
  try {
    const images = req.files;
    const imagesUrl = [];

    const uploadTasks = images.map(async (image) => {
      const optimizedPath = `uploads/optimized-${Date.now()}-${image.originalname}`;

      // Resize and compress image
      await sharp(image.path)
        .resize({ width: 1000 }) // Resize to max width 1000px (optional)
        .jpeg({ quality: 80 })   // Compress JPEG quality to 80%
        .toFile(optimizedPath);

      const result = await cloudinary.uploader.upload(optimizedPath, {
        resource_type: "image",
        public_id: `images/${Date.now()}-${image.originalname.split(".")[0]}`,
      });

      const publicId = result.public_id;

      const optimizedUrl = cloudinary.url(publicId, {
        fetch_format: "auto",
        quality: "auto",
      });

      const croppedUrl = cloudinary.url(publicId, {
        crop: "auto",
        gravity: "auto",
        width: 500,
        height: 500,
        fetch_format: "auto",
        quality: "auto",
      });

      // Cleanup
      await fs.promises.unlink(image.path);        // original
      await fs.promises.unlink(optimizedPath);     // optimized temp

      return {
        original: result.secure_url,
        optimized: optimizedUrl,
        cropped: croppedUrl,
      };
    });

    req.images = await Promise.all(uploadTasks);
    next();
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Failed to upload images" });
  }
});

module.exports = uploadMultiple;
