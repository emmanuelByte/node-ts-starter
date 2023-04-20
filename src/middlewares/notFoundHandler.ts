// src/middlewares/notFoundHandler.ts
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../helpers/error';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // If no route matches, create a NotFoundError
  const error = new NotFoundError(`Resource not found: ${req.originalUrl}`);
  next(error);
};

export default notFoundHandler;
