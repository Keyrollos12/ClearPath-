
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../db/repo/user.reposcitory.js";
import * as AppError from "../../utils/error/index.js";
import {comparePassword,hashPassword} from "../../utils/hash/index.js";
import { generateToken } from "../../utils/token/index.js";
import { generateOTP, generateOTPExpiry } from "../../utils/otp/index.js";
import { sendMail } from "../../utils/email/index.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userRepo = new UserRepository();

class AuthService {
    async register(req, res, next) {
        try {
            const { email, password, fullName, phoneNumber, gender } = req.body;

            const userExist = await userRepo.exist({ email });
            if (userExist) throw new AppError.conflictException("User already exists");

            const hashedPassword =await hashPassword(password);
            const otp = generateOTP();
            const otpExpiry = generateOTPExpiry(5 * 60 * 60 * 1000);

            const newUser = await userRepo.create({
                firstName: fullName.split(" ")[0] || "",
                lastName: fullName.split(" ")[1] || "",
                email,
                password: hashedPassword,
                phoneNumber,
                gender,
                otp,
                otpExpiry,
                isVerified: false,
            });

            await sendMail({
                to: email,
                subject: "Email Confirmation",
                html: `<h1>Your OTP is ${otp}</h1>`,
            });

            return res.status(201).json({ message: "User created successfully", newUser });
        } catch (err) {
            next(err);
        }
    }

    async verifyAccount(req, res, next) {
        try {
            const { email, otp } = req.body;
            const user = await userRepo.getOne({ email });

            if (!user) throw new AppError.BadRequestException("User not found");
            if (!user.otp || !user.otpExpiry) throw new AppError.BadRequestException("OTP not found or expired");
            if (user.otp !== otp) throw new AppError.BadRequestException("Invalid OTP");
            if (user.otpExpiry < new Date()) throw new AppError.BadRequestException("OTP expired");

            await userRepo.update({ email }, { isVerified: true, $unset: { otp: "", otpExpiry: "" } });
            return res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await userRepo.getOne({ email });
            

            if (!user || !comparePassword(password, user.password)) {
                throw new AppError.forbiddenException("Invalid credentials");
            }
           


       const accessToken = generateToken({
            payload: { id: user._id.toString(), role: user.role },
            options: { expiresIn: "1d" }
        });

        const refreshToken = generateToken({
            payload: { id: user._id.toString(), role: user.role },
            options: { expiresIn: "20d" }
        });
            return res.status(200).json({ message: "Logged in successfully", data: { accessToken, refreshToken } });
        } catch (err) {
            next(err);
        }
    }

  

    async loginWithGoogle(req, res, next) {
        try {
            const { idToken } = req.body;
            if (!idToken) throw new AppError.forbiddenException("Google token required");

            const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            if (!payload) throw new AppError.forbiddenException("Invalid Google token");

            let user = await userRepo.getOne({ email: payload.email });
            if (!user) {
                user = await userRepo.create({
                    firstName: payload.given_name || "",
                    lastName: payload.family_name || "",
                    email: payload.email,
                    isVerified: true,
                    password: "",
                    role: 0,
                    userAgent: 1,
                });
            }

            const accessToken = generateToken({ payload: { id: user._id, role: user.role }, options: { expiresIn: "1d" } });
            const refreshToken = generateToken({ payload: { id: user._id, role: user.role }, options: { expiresIn: "20d" } });

            return res.status(200).json({ message: "Google login successful", data: { accessToken, refreshToken, user } });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthService();