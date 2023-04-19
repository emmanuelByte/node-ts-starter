/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { IUser } from '../infra/db/mongoose/models/User';
import { BadRequestError } from '../helpers/error';
import { sendResponse } from '../helpers/response';
import UserService from '../services/userService';
export default class UserController {
  constructor(private userService: UserService) {}
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const userData: IUser = req.body;
      const user = await this.userService.registerUser(userData);
      return sendResponse(res, 201, 'User created successfully', user);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
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
