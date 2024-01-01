import { Request, NextFunction } from "express";
import Joi from "joi";

export function validateRequest(
  req: Request,
  next: NextFunction,
  schema: Joi.ObjectSchema
) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const reqPayloads = [req.body, req.params, req.query];
  for (let reqPayload of reqPayloads) {
    if (reqPayload && Object.keys(reqPayload).length > 0) {
      const err_val = schema.validate(reqPayload, options);
      const error = err_val.error;
      const value = err_val.value;
      if (!error && value) {
        reqPayload = value;
        next();
        return;
      } else {
        next(
          `Validation error: ${error?.details
            .map((x) => x.message)
            .join(", ")}`
        );
      }
    }
  }
}
