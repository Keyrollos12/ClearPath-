import Joi from "joi";

/* =========================
   REGISTER SCHEMA
========================= */
export const registerSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.min": "Full name must be at least 3 characters",
      "string.max": "Full name must be at most 50 characters",
      "any.required": "Full name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 30 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and number",
      "any.required": "Password is required",
    }),

  phoneNumber: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must contain only digits and be 10-15 digits",
      "any.required": "Phone number is required",
    }),

  gender: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.only": "Gender must be either 'male' or 'female'",
      "any.required": "Gender is required",
    }),
});

/* =========================
   LOGIN SCHEMA
========================= */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/* =========================
   VERIFY SCHEMA
========================= */
export const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

/* =========================
   GOOGLE LOGIN
========================= */
export const googleLoginSchema = Joi.object({
  idToken: Joi.string().min(10).required(),
});