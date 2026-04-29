import Joi from "joi";
import * as AppError from "../utils/error/index.js";

export const isValid = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      // Support object format: { body: JoiSchema, params: JoiSchema, query: JoiSchema }
      if (schema && typeof schema === "object" && !schema.validate) {
        const errors = [];

        if (schema.body) {
          const { error, value } = schema.body.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
          });
          if (error) errors.push(...error.details.map((d) => ({ source: "body", path: d.path.join("."), message: d.message })));
          else req.body = value;
        }

        if (schema.params) {
          const { error, value } = schema.params.validate(req.params, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
          });
          if (error) errors.push(...error.details.map((d) => ({ source: "params", path: d.path.join("."), message: d.message })));
          else req.params = value;
        }

        if (schema.query) {
          const { error, value } = schema.query.validate(req.query, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
          });
          if (error) errors.push(...error.details.map((d) => ({ source: "query", path: d.path.join("."), message: d.message })));
          else req.query = value;
        }

        if (errors.length) {
          return next(new AppError.BadRequestException(JSON.stringify(errors)));
        }

        return next();
      }

      // Legacy flat schema format
      let data;
      if (source === "body") data = req.body;
      else if (source === "params") data = req.params;
      else if (source === "query") data = req.query;
      else data = { ...req.body, ...req.params, ...req.query };

      const { error, value } = schema.validate(data, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((issue) => ({
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
