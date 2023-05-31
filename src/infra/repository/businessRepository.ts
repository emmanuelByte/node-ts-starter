// src/infra/repository/userRepository.ts

import mongoose, { UpdateWriteOpResult } from 'mongoose';
import { BadRequestError, MongoError } from '../../helpers/error';
import Business, { IBusiness } from '../db/mongoose/models/Business';

export class BusinessRepository {
  static async create(business: IBusiness): Promise<IBusiness | undefined> {
    try {
      const newBusiness = await Business.create(business);
      return newBusiness as IBusiness;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }

  static async findById(_id: string): Promise<IBusiness | undefined> {
    try {
      const business = await Business.findOne({ _id });
      if (!business) throw new BadRequestError('Business does not exist');
      return business.toObject() as IBusiness;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
  static async findByUserId(userId: string): Promise<IBusiness[] | undefined> {
    try {
      const businesses = await Business.find({ userId });
      if (!businesses) throw new BadRequestError('User does not exist');
      return businesses as IBusiness[];
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
  static async update(_id: string, data: Partial<IBusiness>): Promise<UpdateWriteOpResult | undefined> {
    try {
      await this.findById(_id);
      return await Business.updateOne({ _id }, { $set: data });
    } catch (err) {
      if (err instanceof MongoError) {
        //
      }
    }
  }
  static async aggregateWithUser(_id: string): Promise<IBusiness | undefined> {
    try {
      const [business] = await Business.aggregate([
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
      if (!business) throw new BadRequestError('Business does not exist');
      return business as IBusiness;
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
}
