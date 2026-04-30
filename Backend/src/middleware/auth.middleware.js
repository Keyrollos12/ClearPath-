import * as AppError from "../utils/error/index.js";
import mongoose from "mongoose";
import { UserRepository } from "../db/repo/user.reposcitory.js";
import { verifyAccessToken } from "../utils/token/index.js";

const userRepo = new UserRepository();

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    let refreshToken = req.headers["x-refresh-token"]; // 👈 ناخده من header

    if (!token) {
      throw new AppError.forbiddenException("Access token required");
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    try {
      // ✅ حاول تحقق access token
      const payload = verifyAccessToken(token);

      const user = await userRepo.getOne({ _id: payload.id });

      if (!user) {
        throw new AppError.forbiddenException("User not found");
      }

      if ((payload.tv ?? 0) !== (user.tokenVersion ?? 0)) {
        throw new AppError.forbiddenException("Token invalid");
      }

      req.user = user;
      return next();

    } catch (err) {

      // 🔴 لو access token expired
      if (err.name === "TokenExpiredError") {

        if (!refreshToken) {
          throw new AppError.forbiddenException("Refresh token required");
        }

        try {
          const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
          );

          const user = await userRepo.getOne({ _id: payload.id });

          if (!user) {
            throw new AppError.forbiddenException("User not found");
          }

          if ((payload.tv ?? 0) !== (user.tokenVersion ?? 0)) {
            throw new AppError.forbiddenException("Invalid refresh token");
          }

          // ✅ generate new access token
          const newAccessToken = jwt.sign(
            { id: user._id, role: user.role, tv: user.tokenVersion },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );

          // 🔥 مهم: رجّع التوكن الجديد في response
          res.setHeader("x-new-token", newAccessToken);

          req.user = user;

          return next();

        } catch (refreshErr) {
          throw new AppError.forbiddenException("Invalid refresh token");
        }
      }

      throw err;
    }

  } catch (err) {
    next(err);
  }
};
export const allowTo = (...roles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!roles.includes(userRole)) {
        return next(
          new AppError.forbiddenException("Not allowed to perform this action")
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};