import type { NextFunction, Request, Response } from 'express';
import { ZodError, AnyZodObject } from 'zod';

/**
 * // REVIEW: add ZodTypeAny?
 */
interface RequestValidators {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

export const validateRequest = (validators: RequestValidators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }

      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }

      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422);
      }

      next(error);
    }
  };
};
