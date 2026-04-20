import Joi from "joi";
import * as AppError from "../utils/error/index.js";

export const isValid = (schema) => {
  return (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };

      const { error, value } = schema.validate(data, {
        abortEarly: false,
        allowUnknown: true, // 👈 أهم سطر
        stripUnknown: true, // ينضف الداتا
      });

      if (error) {
        const errors = error.details.map(issue => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return next(new AppError.BadRequestException(JSON.stringify(errors)));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};