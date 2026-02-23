import { verifyRefreshToken, generateToken, generateRefreshToken } from "../token/index.js";
import  Token  from "../../db/models/token.model.js"; // افترض عندك موديل Token
import * as AppError from "../error/index.js";

export const globalErrorHandler = async (err, req, res, next) => {
  try {
    // 🔹 حالة JWT منتهية
    if (err.message === "jwt expired") {
      const refreshToken = req.headers["refreshtoken"];
      if (!refreshToken) {
        throw new AppError.forbiddenException("Refresh token is required");
      }

      const payload = verifyRefreshToken({ token: refreshToken });
      if (!payload) {
        throw new AppError.forbiddenException("Refresh token is invalid");
      }

      const tokenExist = await Token.findOneAndDelete({ token: refreshToken, type: "refresh" });
      if (!tokenExist) {
        throw new AppError.forbiddenException("Refresh token is invalid");
      }

      // 🔹 إنشاء tokens جديدة
      const accessToken = generateToken({ payload: { id: payload.id } });
      const newRefreshToken = generateRefreshToken({ payload: { id: payload.id } });

      await Token.create({
        token: newRefreshToken,
        userId: payload.id,
        type: "refresh",
      });

      return res.status(200).json({
        message: "User refreshed successfully",
        data: { accessToken, refreshToken: newRefreshToken },
      });
    }

    // 🔹 أي خطأ آخر
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
      success: false,
    });
  } catch (error) {
    // 🔹 خطأ أثناء التعامل مع الـ refresh
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};