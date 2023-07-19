// src/infra/repository/userRepository.ts

import { BadRequestError, MongoError } from '../../helpers/error';
import { responseType } from '../../helpers/response';
import User from '../db/mongoose/models/User';

export class PinRepository {
  static async create(data: { pin: string; userId: string }): Promise<Pick<responseType, 'success'> | undefined> {
    try {
      const { pin, userId } = data;

      await User.updateOne({ _id: userId }, { $set: { pin } });
      return {
        success: true,
      };
    } catch (err) {
      if (err instanceof MongoError) throw new BadRequestError(err.message);
    }
  }
}
