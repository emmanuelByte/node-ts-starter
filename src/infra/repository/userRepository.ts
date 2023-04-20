// src/infra/repository/userRepository.ts

import { UpdateWriteOpResult } from 'mongoose';
import { BadRequestError } from '../../helpers/error';
import UserModel, { IUser } from '../db/mongoose/models/User';

export class UserRepository {
  static async create(user: Pick<IUser, 'email' | 'password'>): Promise<IUser | undefined> {
    try {
      const newUser = await UserModel.create(user);
      return newUser.toObject() as IUser;
    } catch (err: any) {
      let message;
      if (err.code === 11000) message = 'User already exist';
      //   if (err.name==="ValidationError") message=''
      //   console.log(err.name);
      throw new BadRequestError(message || err.message);
    }
  }

  static async findById(_id: string): Promise<IUser | undefined> {
    try {
      const user = await UserModel.findOne({ _id });
      if (!user) throw new BadRequestError('User does not exist');
      return user.toObject() as IUser;
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }
  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) throw new BadRequestError('User does not exist');
      return user.toObject() as IUser;
    } catch (err: any) {
      throw new BadRequestError(err.message);
    }
  }
  static async update(_id: string, data: Partial<IUser>): Promise<UpdateWriteOpResult | undefined> {
    try {
      const user = (await this.findById(_id)) as IUser;
      return await UserModel.updateOne({ _id }, { $set: data });
    } catch (err: any) {}
  }
}
