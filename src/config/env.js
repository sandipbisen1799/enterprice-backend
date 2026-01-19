import dotenv from "dotenv"
dotenv.config();

const env = {
    MONGODB_URL : process.env.MONGODB_URL,
    CORS_ORIGIN : process.env.CORS_ORIGIN,
    PORT : process.env.PORT,
    JWT_SECRET : process.env.JWT_SECRET,
    MAIL_USER : process.env.MAIL_USER,
    MAIL_PASS :process.env.MAIL_PASS ,
    MAIL_HOST :process.env.MAIL_HOST,
    CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME
}

console.log('MONGODB_URL:', process.env.MONGODB_URL);

export default env ;