/* eslint-disable @typescript-eslint/no-explicit-any */
// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from 'express';
import config from '../config/config';

// Import custom error classes, e.g.
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError } from '../helpers/error';
import Logger from '../core/Logger';
const log = new Logger();
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  switch (err.name) {
    // Add cases for each custom error class
    case UnauthorizedError.name:
    case NotFoundError.name:
    case InternalServerError.name:
    case BadRequestError.name:
      return res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
      });
    default:
      log.error(err.message, {
        // Uncomment this line if you have a logger set up
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        stack: err.stack,
      });
      //   if (err.code === 'LIMIT_FILE_SIZE') {
      //     return res.status(400).json({
      //       success: false,
      //       errors: [
      //         {
      //           code: 400,
      //           message: 'File size is too large',
      //         },
      //       ],
      //     });
      //   }
      return res.status(500).json({
        success: false,
        errors: [
          {
            message: 'An error occurred',
            ...(config.app.env === 'development' || config.app.env === 'test' ? { stack: err.stack } : {}),
          },
        ],
      });
  }
};

export default errorHandler;
