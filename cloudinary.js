const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'airbnb_DEV',
      // Cloudinary upload API option (note the exact key name)
      allowed_formats: ["png", "jpg", "jpeg", "heic", "heif"],
    },
  });

  module.exports = {
    cloudinary,
    storage,
  };

   
