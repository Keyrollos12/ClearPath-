import nodemailer from "nodemailer";
import { devConfig } from "../../config/env/dev.config.js";

export const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: devConfig.EMAIL,
      pass: devConfig.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: devConfig.EMAIL,
    to,
    subject,
    html,
  });
};