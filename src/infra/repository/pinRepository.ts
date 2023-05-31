// src/infra/repository/userRepository.ts

import mongoose, { UpdateWriteOpResult } from 'mongoose';
import { BadRequestError, MongoError } from '../../helpers/error';
import Pin, { IPin } from '../db/mongoose/models/Pin';

export class PinRepository {
  static async create(pin: IPin): Promise<IPin | undefined> {
    try {
      const newPin = await Pin.create(pin);
      return newPin as IPin;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }

  static async findById(_id: string): Promise<IPin | undefined> {
    try {
      const pin = await Pin.findOne({ _id });
      if (!pin) throw new BadRequestError('Pin does not exist');
      return pin.toObject() as IPin;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
  static async findByUserId(userId: string): Promise<IPin | undefined> {
    try {
      const pins = await Pin.findOne({ userId });
      if (!pins) throw new BadRequestError('User does not exist');
      return pins as IPin;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
  static async update(_id: string, data: Partial<IPin>): Promise<UpdateWriteOpResult | undefined> {
    try {
      await this.findById(_id);
      return await Pin.updateOne({ _id }, { $set: data });
    } catch (err) {
      //
    }
  }
  static async aggregateWithUser(_id: string): Promise<IPin | undefined> {
    try {
      const [pin] = await Pin.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id),
          },
        },
        {
          $lookup: {
            as: 'user',
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            user: {
              password: 0,
            },
            userId: 0,
          },
        },
      ]);
      if (!pin) throw new BadRequestError('Pin does not exist');
      return pin as IPin;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
}
