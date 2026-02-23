import * as AppError from "../utils/error/index.js";
import { verifyAccessToken } from "../utils/token/index.js";
import { UserRepository } from "../db/user.reposcitory.js";
import mongoose from "mongoose";

const userRepo = new UserRepository();

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new AppError.forbiddenException("Access token required");

    if (token.startsWith("Bearer ")) token = token.split(" ")[1];

    const payload = verifyAccessToken(token);
    
    const user = await userRepo.getOne({
      _id: new mongoose.Types.ObjectId(payload.id),
    });

    if (!user) throw new AppError.forbiddenException("Unauthorized: user not found");

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};