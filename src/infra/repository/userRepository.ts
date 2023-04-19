// src/infra/repository/userRepository.ts
import { User, UserRepository } from "../../domain/User";
import UserModel from "../db/mongoose/models/User";

export class MongooseUserRepository implements UserRepository {
  async create(user: Omit<User, "id">): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toObject() as User;
  }

  async findById(_id: string): Promise<User | null> {
    const user = await UserModel.findOne({ _id });
    if (!user) return null;
    return user.toObject() as User;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return user.toObject() as User;
  }
}
