import * as AppError from "src/utils/error/index.js";
import { ZodType } from "zod";

export const isValid = (schema) => {
  return (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.issues.map(issue => ({
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