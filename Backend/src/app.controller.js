import {connectDB} from "./db/connection.js";
import { globalErrorHandler } from "./utils/error/globalErrorHandler.js";
import authRouter from "./module/auth/auth.router.js";

    const bootstrap = async (app, express) => {
    
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use(globalErrorHandler);

    }
    
export default bootstrap;