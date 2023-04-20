import { Request, Response, NextFunction } from 'express';

import { BadRequestError, UnauthorizedError } from '../helpers/error';
import { IUser } from '../infra/db/mongoose/models/User';
import UserService from '../services/userService';
import { UserRepository } from '../infra/repository/userRepository';
import { JwtPayload } from 'jsonwebtoken';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new BadRequestError('No token provided'));
  }

  try {
    const decoded = (await UserService.verifyToken(token)) as JwtPayload;
    const user = (await UserRepository.findById(decoded.id)) as IUser;
    user.password = undefined;
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid token'));
  }
};
