import {connectDB} from "./db/connection.js";
import { globalErrorHandler } from "./utils/error/globalErrorHandler.js";
import authRouter from "./module/auth/auth.router.js";
import activityRouter from "./module/activity/activity.router.js";
import customTripRouter from "./module/customTrip/customTrip.router.js";
import experienceRouter from "./module/experience/experience.router.js";
import userRouter from "./module/user/user.router.js";

    const bootstrap = async (app, express) => {
    
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use("/activity", activityRouter);
    app.use("/customTrip", customTripRouter);
    app.use("/experience", experienceRouter);
    app.use("/user", userRouter);
    app
    app.use(globalErrorHandler);

    }
    
export default bootstrap;