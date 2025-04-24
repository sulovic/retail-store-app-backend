import * as z from "zod";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface RequestWithValidatedData<T> extends Request {
    body: T;
}

const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: RequestWithValidatedData<T>, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        }));
        return res.status(400).json({ errors: errorMessages });
      }
      next(error);
    }
  };
};

export default validateRequest;