import { NextFunction, Request, Response } from 'express';
import { IUser } from '../infra/db/mongoose/models/User';
import { sendResponse } from '../helpers/response';
import UserService from '../services/userService';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, CustomError } from '../helpers/error';
class UserController {
  static async checkEmail(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const service = await UserService.checkEmail(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'email checked successfully',
        ...service,
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = await UserService.registerUser(req, res, next);
      if (user)
        return sendResponse({
          res,
          statusCode: StatusCodes.CREATED,
          message: 'User registered successfully',
          data: user,
        });
    } catch (error) {
      if (error instanceof CustomError) {
        return next(new BadRequestError(error.message));
      }
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const user = (await UserService.login(req, res, next)) as IUser;
      const token = UserService.generateToken(user);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'User logged in successfully',
        data: { token, ...user, password: undefined },
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async sendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      await UserService.sendVerificationEmail(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'verification email sent successfully',
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      await UserService.verifyEmail(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'User verified successfully',
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async sendForgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      await UserService.sendForgotPassword(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'reset password code  sent successfully',
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async verifyForgotPassword(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      await UserService.verifyForgotPassword(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'Password Reset successfully',
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const user = await UserService.getProfile(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        message: 'User profile fetched',
        data: user,
      });
    } catch (error) {
      // console.log(error);
    }
  }
}
export default UserController;
