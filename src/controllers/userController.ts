import { NextFunction, Request, Response } from 'express';
import { IUser } from '../infra/db/mongoose/models/User';
import { sendResponse } from '../helpers/response';
import UserService from '../services/userService';
import { StatusCodes } from 'http-status-codes';
class UserController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const user = await UserService.registerUser(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      // console.log(error);
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
  static async completeRegistration(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const business = await UserService.completeRegistration(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'Registration completed successfully',
        data: business,
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async createPin(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const pin = await UserService.createPin(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'Created Pin successfully',
        data: pin,
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async updatePin(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const pin = await UserService.updatePin(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'Updated Pin successfully',
        data: pin,
      });
    } catch (error) {
      // console.log(error);
    }
  }
  static async verifyPin(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const pin = await UserService.verifyPin(req, res, next);
      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        message: 'Verified Pin successful',
        data: pin,
      });
    } catch (error) {
      // console.log(error);
    }
  }
}
export default UserController;
