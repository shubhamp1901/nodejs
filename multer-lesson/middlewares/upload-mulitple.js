const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

// const uploadMultiple = asyncHandler(async (req, res, next) => {
//   try {
//     const images = req.files;
//     const imagesUrl = [];

//     for (let image of images) {
//       const result = await cloudinary.uploader.upload(image.path, {
//         resource_type: "image",
//         public_id: `images/${Date.now()}-${image.originalname.split(".")[0]}`,
//       });

//       const publicId = result.public_id;

//       const optimizedUrl = cloudinary.url(publicId, {
//         fetch_format: "auto", // Converts to WebP/AVIF if supported
//         quality: "auto", // Auto-select best quality for size
//       });

//       const croppedUrl = cloudinary.url(publicId, {
//         crop: "auto",
//         gravity: "auto",
//         width: 500,
//         height: 500,
//         fetch_format: "auto",
//         quality: "auto",
//       });

//       imagesUrl.push({
//         original: result.secure_url,
//         optimized: optimizedUrl,
//         cropped: croppedUrl,
//       });

//       // Step 3: Delete temp file from local storage
//       await fs.promises.unlink(image.path);
//     }

//     req.images = imagesUrl;
//     next();
//   } catch (error) {
//     console.error("Upload failed:", error);
//     res.status(500).json({ message: "Failed to upload images" });
//   }
// });

const uploadMultiple = asyncHandler(async (req, res, next) => {
  try {
    const images = req.files;

    const uploadTasks = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
        public_id: `images/${Date.now()}-${image.originalname.split(".")[0]}`,
      });

      const publicId = result.public_id;

      const optimizedUrl = cloudinary.url(publicId, {
        fetch_format: "auto",
        quality: "auto",
      });

    //   const croppedUrl = cloudinary.url(publicId, {
    //     crop: "auto",
    //     gravity: "auto",
    //     width: 500,
    //     height: 500,
    //     fetch_format: "auto",
    //     quality: "auto",
    //   });

      await fs.promises.unlink(image.path);

      return {
        original: result.secure_url,
        optimized: optimizedUrl,
        // cropped: croppedUrl,
      };
    });

    // Wait for all uploads to finish in parallel
    const imagesUrl = await Promise.all(uploadTasks);

    req.images = imagesUrl;
    next();
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Failed to upload images" });
  }
});


module.exports = uploadMultiple;
