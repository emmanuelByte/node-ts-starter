import { Request, Response, NextFunction } from "express";

import { UnauthorizedError } from "../helpers/error";
import { IUser } from "../infra/db/mongoose/models/User";
import UserService from "../services/userService";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const decoded = (await UserService.verifyToken(token)) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};
