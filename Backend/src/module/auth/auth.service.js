
import { OAuth2Client } from "google-auth-library";
import { UserRepository } from "../../db/repo/user.reposcitory.js";
import * as AppError from "../../utils/error/index.js";
import { comparePassword } from "../../utils/hash/index.js";
import { generateRefreshToken, generateToken } from "../../utils/token/index.js";
import { generateOTP, generateOTPExpiry } from "../../utils/otp/index.js";
import { sendMail } from "../../utils/email/index.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userRepo = new UserRepository();

class AuthService {
    buildUserResponse(user) {
        if (!user) return null;
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            isVerified: user.isVerified,
            role: user.role
        };
    }

    buildTokenPayload(user) {
        return {
            id: user._id.toString(),
            role: user.role,
            tv: user.tokenVersion ?? 0
        };
    }

    async register(req, res, next) {
        try {
            const { email, password, fullName, phoneNumber, gender } = req.body;

            const userExist = await userRepo.exist({ email });
            if (userExist) throw new AppError.conflictException("User already exists");
            const otp = generateOTP();
            const otpExpiry = generateOTPExpiry(5 * 60 * 60 * 1000);

            const newUser = await userRepo.create({
                firstName: fullName.split(" ")[0] || "",
                lastName: fullName.split(" ")[1] || "",
                email,
                // Password hashing is handled by the user model pre-save hook.
                password,
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

            return res.status(201).json({
                message: "User created successfully",
                user: this.buildUserResponse(newUser)
            });
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

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await userRepo.getOne({ email });

            if (!user) throw new AppError.BadRequestException("User not found");
            if (user.userAgent === 1) {
                throw new AppError.BadRequestException("Password reset is not available for Google accounts");
            }

            const otp = generateOTP();
            const otpExpiry = generateOTPExpiry(15 * 60 * 1000);

            await userRepo.update({ email }, { otp, otpExpiry });
            await sendMail({
                to: email,
                subject: "Reset Password OTP",
                html: `<h1>Your reset OTP is ${otp}</h1><p>This code expires in 15 minutes.</p>`,
            });

            return res.status(200).json({
                message: "Reset OTP sent to your email",
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, otp, newPassword } = req.body;
            const user = await userRepo.getOne({ email });

            if (!user) throw new AppError.BadRequestException("User not found");
            if (!user.otp || !user.otpExpiry) throw new AppError.BadRequestException("OTP not found or expired");
            if (user.otp !== otp) throw new AppError.BadRequestException("Invalid OTP");
            if (user.otpExpiry < new Date()) throw new AppError.BadRequestException("OTP expired");

            user.password = newPassword;
            user.otp = undefined;
            user.otpExpiry = undefined;
            user.tokenVersion = (user.tokenVersion ?? 0) + 1;
            await user.save();

            return res.status(200).json({
                message: "Password reset successfully",
                success: true
            });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await userRepo.getOne({ email });

            if (!user || !(await comparePassword(password, user.password))) {
                throw new AppError.forbiddenException("Invalid credentials");
            }
            if (!user.isVerified) {
                throw new AppError.forbiddenException("Please verify your account first");
            }

            const tokenPayload = this.buildTokenPayload(user);
            const accessToken = generateToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);

            return res.status(200).json({
                message: "Logged in successfully",
                data: { accessToken, refreshToken, user: this.buildUserResponse(user) }
            });
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
            if (!payload.email) throw new AppError.forbiddenException("Google account has no email");

            let user = await userRepo.getOne({ email: payload.email });
            if (!user) {
                user = await userRepo.create({
                    firstName: payload.given_name || "",
                    lastName: payload.family_name || "",
                    email: payload.email,
                    isVerified: true,
                    password: "",
                    role: "user",
                    userAgent: 1
                });
            }

            const tokenPayload = this.buildTokenPayload(user);
            const accessToken = generateToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);

            return res.status(200).json({
                message: "Google login successful",
                data: { accessToken, refreshToken, user: this.buildUserResponse(user) }
            });
        } catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
    try {
        await userRepo.update(
            { _id: req.user._id },
            { $inc: { tokenVersion: 1 } }
        );

        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (err) {
        next(err);
    }
}
}

export default new AuthService();