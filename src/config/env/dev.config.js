import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./src/config/env/dev.env") });  // صحح المسار بالنسبة لقاعدة src

export const devConfig = {
    PORT: process.env.PORT||3001,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    CLOUD_NAME: process.env.CLOUD_NAME,
    DB_URL: process.env.DB_URL,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};


