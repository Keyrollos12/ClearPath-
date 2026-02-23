import mongoose, { Schema } from "mongoose";
import { SYS_Role, GENDER, USER_AGENT } from "src/utils/common/enum/index.js";
import bcrypt from "bcrypt";
import { sendMail } from "src/utils/email/index.js";

export const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.userAgent === USER_AGENT.local;
      },
    },

    credentialUpdateAt: Date,

    phoneNumber: String,

    gender: {
      type: String,
      enum: Object.values(GENDER),
    },

    role: {
      type: Number,
      enum: Object.values(SYS_Role),
      default: SYS_Role.user,
    },

    userAgent: {
      type: Number,
      enum: Object.values(USER_AGENT),
      default: USER_AGENT.local,
    },

    otp: String,

    otpExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//////////////////////////////////////////////////////////
// Virtual fullName
//////////////////////////////////////////////////////////

userSchema.virtual("fullName")
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (value) {
    const parts = value.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[1] || "";
  });

//////////////////////////////////////////////////////////
// Hash password
//////////////////////////////////////////////////////////

userSchema.pre("save", async function (next) {
  try {
    if (
      this.userAgent === USER_AGENT.local &&
      this.isModified("password") &&
      this.password
    ) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

      this.credentialUpdateAt = new Date();
    }

    next();
  } catch (err) {
    next(err);
  }
});

//////////////////////////////////////////////////////////
// Send OTP email on create
//////////////////////////////////////////////////////////

userSchema.post("save", async function (doc, next) {
  try {
    if (
      doc.userAgent === USER_AGENT.local &&
      doc.isNew &&
      doc.otp
    ) {
      await sendMail({
        to: doc.email,
        subject: "Email Confirmation",
        html: `<h2>Your OTP is: ${doc.otp}</h2>`,
      });
    }

    next();
  } catch (err) {
    next(err);
  }
});

//////////////////////////////////////////////////////////
// Export model
//////////////////////////////////////////////////////////

export const User = mongoose.model("User", userSchema);