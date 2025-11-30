import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// __dirname setup (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
/*const uploadOnCloudinary = async (localFilePath) => {
    console.log(
        process.env.CLOUDINARY_CLOUD_NAME,
        process.env.CLOUDINARY_API_KEY,
        process.env.CLOUDINARY_API_SECRET
    );

    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            streaming_profile: "hd"
        });
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log('cloudinary upload failed ', error);
    }
    try {
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    } catch (unlinkErr) {
        console.warn('Failed to delete local temp file:', unlinkErr);
    }
};
*/


const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      streaming_profile: 'hd',
    });
    return response;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw error; // optional: propagate to caller
  } finally {
    // Always attempt to delete local file
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log('Local temp file deleted:', localFilePath);
      }
    } catch (unlinkErr) {
      console.warn('Failed to delete local temp file:', unlinkErr);
    }
  }
};
export { uploadOnCloudinary, cloudinary };
