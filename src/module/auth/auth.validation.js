import { z } from "zod";


export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters")
    
    ,

  email: z
    .string()
    .email("Invalid email format")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Email format is invalid"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .refine(
      (val) =>
        /[A-Z]/.test(val) && // حرف كبير
        /[a-z]/.test(val) && // حرف صغير
        /[0-9]/.test(val) && // رقم
      
      "Password must contain uppercase, lowercase, number, and special character"
    ),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .refine(
      (val) => /^\d{10,15}$/.test(val),
      "Phone number must contain only digits"
    ),

  gender: z.enum(["male", "female"], "Gender must be either 'male' or 'female'"),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const verifySchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 characters"),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(10, "Invalid Google token"),
});