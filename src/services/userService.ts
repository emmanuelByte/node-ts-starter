import { IUser } from '../infra/db/mongoose/models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { BadRequestError, CustomError } from '../helpers/error';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../infra/repository/userRepository';
import { generateOTP } from '../helpers/helpers';

import { PinRepository } from '../infra/repository/pinRepository';
import sendEmail from '../infra/email';
import { responseType } from '../helpers/response';

export default class UserService {
  static async registerUser(req: Request, res: Response, next: NextFunction): Promise<IUser | void> {
    try {
      const userData = req.body;
      const unHashPassword = userData.password as string;
      const salt = await bcrypt.genSalt(10);

      const password = await bcrypt.hash(unHashPassword, salt);
      userData.password = password;
      return await UserRepository.create(userData, next);
    } catch (err) {
      if (err instanceof CustomError) {
        throw next(new BadRequestError(err.message));
      }
    }
  }
  static async checkEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Pick<responseType, 'success' | 'message'> | undefined> {
    const data: Pick<IUser, 'email' | 'password'> = req.body;
    try {
      const { email } = data as { email: string; password: string };
      const user = (await UserRepository.findByEmail(email)) as IUser;
      if (!user) return { success: false, message: 'user not found' };
      return { success: true, message: 'user exist' };
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async login(req: Request, res: Response, next: NextFunction): Promise<IUser | undefined> {
    const data: Pick<IUser, 'email' | 'password'> = req.body;
    try {
      const { email, password } = data as { email: string; password: string };
      const user = (await UserRepository.findByEmail(email)) as IUser;
      const isPasswordValid = await bcrypt.compare(password, user.password as string);
      if (!isPasswordValid) throw new BadRequestError('Invalid Password');
      return user;
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async sendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = (await UserRepository.findByEmail(email)) as IUser;
      const { verification } = user;
      // { emailVerification: { code: string; isVerified: boolean } };
      if (verification?.emailVerification?.isVerified) throw next(new BadRequestError('User already verified'));
      const code = generateOTP();
      await UserRepository.update(user._id, { verification: { emailVerification: { code, isVerified: false } } });
      // TODO: send email
      await sendEmail({
        to: email,
        data: {
          code,
          type: 'verify',
        },
      });
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, email } = req.body;
      const user = (await UserRepository.findByEmail(email)) as IUser;
      const { verification } = user;
      // as { verification: { code: string; isVerified: boolean } };

      if (verification?.emailVerification?.isVerified) throw next(new BadRequestError('User already verified'));
      if (!verification?.emailVerification?.code) throw next(new BadRequestError('Send verification email first'));
      if (code != verification.emailVerification.code) throw new BadRequestError('Incorrect Code');
      await UserRepository.update(user._id, {
        verification: { emailVerification: { isVerified: true } },
      });
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async sendForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const user = (await UserRepository.findByEmail(email)) as IUser;

      const code = generateOTP();
      await UserRepository.update(user._id, { resetPassword: { code } });
      // TODO: send email
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async verifyForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, email, newPassword } = req.body;
      const user = (await UserRepository.findByEmail(email)) as IUser;
      const { resetPassword } = user as { resetPassword: { code: string } };
      if (!resetPassword.code) throw next(new BadRequestError('Send Reset Password email first'));
      if (code != resetPassword.code) throw new BadRequestError('Incorrect Code');
      const hashPassword = await bcrypt.hash(newPassword, 10);

      await UserRepository.update(user._id, {
        resetPassword: {},
        password: hashPassword,
      });
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }

  static async createPin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Pick<responseType, 'success'> | undefined> {
    try {
      const user = req.user as IUser;
      const { pin } = req.body;
      if (user.pin) {
        throw next(new BadRequestError('PIN code already created'));
      }
      const hashCode = await bcrypt.hash(pin, 10);
      const data = { pin: hashCode, userId: user._id };
      return await PinRepository.create(data);
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async updatePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Pick<responseType, 'success'> | undefined> {
    try {
      const user = req.user as IUser;
      const { pin, password } = req.body;
      if (!user.pin) {
        throw next(new BadRequestError('PIN code not yet created'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password as string);
      if (!isPasswordValid) throw new BadRequestError('Invalid Password');
      const hashCode = await bcrypt.hash(pin, 10);

      const data = { pin: hashCode, userId: user._id };
      return await PinRepository.create(data);
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async verifyPin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Pick<responseType, 'success'> | undefined> {
    try {
      const user = req.user as IUser;
      const { pin } = req.body;
      if (!user.pin) {
        throw next(new BadRequestError('PIN code not yet created'));
      }
      const isCodeValid = await bcrypt.compare(pin, user.pin);
      if (!isCodeValid) throw new BadRequestError('Invalid Code');
      return { success: true };
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<IUser | undefined> {
    try {
      const user = req.user as IUser;
      return user;
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
    };
    const jwtConfig = config.jwt as { secret: string; expiresIn: string };
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
  static async verifyToken(token: string): Promise<string | JwtPayload | undefined> {
    return new Promise((resolve, reject) => {
      const jwtConfig = config.jwt as { secret: string; expiresIn: string };
      jwt.verify(
        token,
        jwtConfig.secret,
        (err: unknown, decoded: string | JwtPayload | PromiseLike<string | JwtPayload | undefined> | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        },
      );
    });
  }
}
