import { IUser, REGISTRATION_STATUS } from '../infra/db/mongoose/models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { BadRequestError, CustomError } from '../helpers/error';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../infra/repository/userRepository';
import { generateOTP } from '../helpers/helpers';
import { BusinessRepository } from '../infra/repository/businessRepository';
import { IBusiness } from '../infra/db/mongoose/models/Business';
import { IPin } from '../infra/db/mongoose/models/Pin';
import { PinRepository } from '../infra/repository/pinRepository';

export default class UserService {
  static async registerUser(req: Request, res: Response, next: NextFunction): Promise<IUser | void> {
    try {
      const userData = req.body as Pick<IUser, 'email' | 'password'>;
      const unHashPassword = userData.password as string;
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(unHashPassword, salt);
      return await UserRepository.create({ ...userData, password });
    } catch (err) {
      if (err instanceof CustomError) {
        throw next(new BadRequestError(err.message));
      }
      // console.log(err);
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
      const { verification } = user as { verification: { code: string; isVerified: boolean } };
      if (verification.isVerified) throw next(new BadRequestError('User already verified'));
      const code = generateOTP();
      await UserRepository.update(user._id, { verification: { code, isVerified: false } });
      // TODO: send email
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, email } = req.body;
      const user = (await UserRepository.findByEmail(email)) as IUser;
      const { verification } = user as { verification: { code: string; isVerified: boolean } };

      if (verification.isVerified) throw next(new BadRequestError('User already verified'));
      if (!verification.code) throw next(new BadRequestError('Send verification email first'));
      if (code != verification.code) throw new BadRequestError('Incorrect Code');
      await UserRepository.update(user._id, {
        verification: { isVerified: true },
        registrationStatus: REGISTRATION_STATUS.VERIFY,
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

  static async completeRegistration(req: Request, res: Response, next: NextFunction): Promise<IBusiness | undefined> {
    try {
      const user = req.user as IUser;
      const { firstName, lastName, phoneNumber, businessName, address, sector } = req.body;
      if (user.registrationStatus !== REGISTRATION_STATUS.VERIFY) {
        if (user.registrationStatus === REGISTRATION_STATUS.SIGN_UP) {
          throw next(new BadRequestError('have not verify you account'));
        }
        throw next(new BadRequestError(`You have already completed registration`));
      }

      const businessData = { name: businessName, userId: user._id, sector, address } as IBusiness;
      const b = (await BusinessRepository.create(businessData)) as IBusiness;
      await UserRepository.update(user._id, {
        firstName,
        lastName,
        phoneNumber,
        registrationStatus: REGISTRATION_STATUS.DATA_VERIFY,
      });
      return await BusinessRepository.aggregateWithUser(b._id);
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async createPin(req: Request, res: Response, next: NextFunction): Promise<IUser | undefined> {
    try {
      const user = req.user as IUser;
      const { code } = req.body;
      if (user.registrationStatus === REGISTRATION_STATUS.PIN) {
        throw next(new BadRequestError('PIN code already created'));
      }
      const hashCode = await bcrypt.hash(code, 10);
      const data = { code: hashCode, userId: user._id } as IPin;
      await PinRepository.create(data);
      await UserRepository.update(user._id, { registrationStatus: REGISTRATION_STATUS.PIN });
      return user;
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async updatePin(req: Request, res: Response, next: NextFunction): Promise<IUser | undefined> {
    try {
      const user = req.user as IUser;
      const { code, password } = req.body;
      if (user.registrationStatus !== REGISTRATION_STATUS.PIN) {
        throw next(new BadRequestError('PIN code not yet created'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password as string);
      if (!isPasswordValid) throw new BadRequestError('Invalid Password');
      const hashCode = await bcrypt.hash(code, 10);

      const data = { code: hashCode } as IPin;

      const pin = (await PinRepository.findByUserId(user._id)) as IPin;
      await PinRepository.update(pin._id, data);
      return user;
    } catch (err) {
      if (err instanceof CustomError) throw next(new BadRequestError(err.message));
    }
  }
  static async verifyPin(req: Request, res: Response, next: NextFunction): Promise<IUser | undefined> {
    try {
      const user = req.user as IUser;
      const { code } = req.body;
      if (user.registrationStatus !== REGISTRATION_STATUS.PIN) {
        throw next(new BadRequestError('PIN code not yet created'));
      }
      const pin = (await PinRepository.findByUserId(user._id)) as IPin;
      const isCodeValid = await bcrypt.compare(code, pin.code);
      if (!isCodeValid) throw new BadRequestError('Invalid Code');

      return user;
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
