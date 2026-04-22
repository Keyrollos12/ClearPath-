import * as AppError from "../utils/error/index.js";
import mongoose from "mongoose";
import { UserRepository } from "../db/repo/user.reposcitory.js";
import { verifyAccessToken } from "../utils/token/index.js";

const userRepo = new UserRepository();

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token)
      throw new AppError.forbiddenException("Access token required");

    if (token.startsWith("Bearer "))
      token = token.split(" ")[1];

    const payload = verifyAccessToken(token);
    const user = await userRepo.getOne({ _id: payload.id });

    if (!user) {
      return next(
        new AppError.forbiddenException("Unauthorized: user not found")
      );
    }
    if ((payload.tv ?? 0) !== (user.tokenVersion ?? 0)) {
      return next(new AppError.forbiddenException("Token is no longer valid"));
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
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