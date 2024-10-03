import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as Joi from 'joi';
import { validation } from '../utils/validation';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Creates a middleware function that validates incoming requests against a provided Joi schema.
 * @param schema The Joi schema to validate against
 * @returns An Express middleware function
 */
export const validateRequest = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = validation.validateSchema(schema, {
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      ApiResponse.badRequest(res, 'Validation error', errorMessage);
    } else {
      next();
    }
  };
};

/**
 * Middleware to validate specific parts of the request (body, query, or params)
 * @param part The part of the request to validate ('body' | 'query' | 'params')
 * @param schema The Joi schema to validate against
 * @returns An Express middleware function
 */
export const validateRequestPart = (
  part: 'body' | 'query' | 'params',
  schema: Joi.ObjectSchema
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = validation.validateSchema(schema, req[part]);

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      ApiResponse.badRequest(res, `Validation error in ${part}`, errorMessage);
    } else {
      next();
    }
  };
};

/**
 * Middleware to validate the entire request (body, query, and params)
 * @param schemas An object containing Joi schemas for body, query, and params
 * @returns An Express middleware function
 */
export const validateFullRequest = (schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    Object.entries(schemas).forEach(([key, schema]) => {
      if (schema) {
        const { error } = validation.validateSchema(schema, req[key as keyof typeof schemas]);
        if (error) {
          errors.push(`${key}: ${error.details.map((detail) => detail.message).join(', ')}`);
        }
      }
    });

    if (errors.length > 0) {
      ApiResponse.badRequest(res, 'Validation error', errors.join('; '));
    } else {
      next();
    }
  };
};

/**
 * Middleware to validate array inputs
 * @param schema The Joi schema to validate each array item against
 * @returns An Express middleware function
 */
export const validateArray = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!Array.isArray(req.body)) {
      ApiResponse.badRequest(res, 'Validation error', 'Request body must be an array');
      return;
    }

    const errors = req.body.map((item, index) => {
      const { error } = validation.validateSchema(schema, item);
      return error ? `Item ${index}: ${error.details.map((detail) => detail.message).join(', ')}` : null;
    }).filter(Boolean);

    if (errors.length > 0) {
      ApiResponse.badRequest(res, 'Validation error', errors.join('; '));
    } else {
      next();
    }
  };
};

// Export the validation middleware functions
export const validator = {
  validateRequest,
  validateRequestPart,
  validateFullRequest,
  validateArray,
};