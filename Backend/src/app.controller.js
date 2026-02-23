import {connectDB} from "src/db/connection.js";
import { globalErrorHandler } from "src/utils/error/globalErrorHandler.js";
    // import { rateLimit } from "express-rate-limit";
import authRouter from "src/module/auth/auth.controller.js";

    const bootstrap = async (app, express) => {
    // const limiter = rateLimit({
    //     windowMs: 60 * 1000,
    //     limit: 50,
    //     message: "Too many requests from this IP, please try again after 1 minute",
    //     handler: (req, res, next, options) => {
    //         throw new Error(options.message, { cause: 429 });
    //     },
    //     skipSuccessfulRequests: true,

    // });
  
    // app.use(limiter);
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use(globalErrorHandler);

    }
    
export default bootstrap;