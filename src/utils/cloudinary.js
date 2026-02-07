import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";


cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(
            new Error("Cloudinary upload failed: " + error.message)
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
