/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../infra/db/mongoose/models/User';
import { BadRequestError } from '../helpers/error';
import { sendResponse } from '../helpers/response';
import UserService from '../services/userService';
import { MongooseUserRepository } from '../infra/repository/userRepository';
import routeWrapper from '../helpers/routeWrapper';
class UserController {
  constructor(private userService: UserService) {}
  async register(req: Request, res: Response, next?: NextFunction): Promise<Response> {
    try {
      const userData: Pick<IUser, 'email' | 'password'> = req.body;
      const user = await this.userService.registerUser(userData);
      return sendResponse({ res, statusCode: 201, message: 'User registered successfully', data: user });
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async login(req: Request, res: Response, next?: NextFunction): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login({ email, password });
      if (!user) {
        throw new BadRequestError('Invalid email or password');
      }

      const token = this.userService.generateToken(user);
      return sendResponse(res, 200, 'Logged in successfully', { token });
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }
}
const userRepository = new MongooseUserRepository();
const userService = new UserService(userRepository);
const userController = routeWrapper(new UserController(userService));

export default userController;
