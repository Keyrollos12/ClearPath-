import {connectDB} from "./db/connection.js";
import { globalErrorHandler } from "./utils/error/globalErrorHandler.js";
import authRouter from "./module/auth/auth.router.js";
import activityRouter from "./module/activity/activity.router.js";
import customTripRouter from "./module/customTrip/customTrip.router.js";
import experienceRouter from "./module/experience/experience.router.js";
import userRouter from "./module/user/user.router.js";
import wishlistRouter from "./module/wishlist/wishlist.router.js";
import providerRouter from "./module/provider/provider.router.js";
import destinationRouter from "./module/destination/destination.router.js";
import bookingRouter from "./module/booking/booking.router.js";
import reviewRouter from "./module/review/review.router.js";
import paymentRouter from "./module/payment/payment.router.js";

const bootstrap = async (app, express) => {
    
    app.use(express.json());
    connectDB();
    app.use("/auth", authRouter);
    app.use("/activity", activityRouter);
    app.use("/customTrip", customTripRouter);
    app.use("/experience", experienceRouter);
    app.use("/user", userRouter);
    app.use("/wishlist", wishlistRouter);
    app.use("/provider", providerRouter);
    app.use("/destination", destinationRouter);
    app.use("/booking", bookingRouter);
    app.use("/review", reviewRouter);
    app.use("/payment", paymentRouter);
    app.use(globalErrorHandler);

}
    
export default bootstrap;
