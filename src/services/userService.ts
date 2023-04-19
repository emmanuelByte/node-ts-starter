import UserModel, { IUser } from '../infra/db/mongoose/models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import { User, UserRepository } from '../domain/User';

export default class UserService {
  constructor(private userRepository: UserRepository) {}
  async registerUser(userData: IUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }
  async login(data: Pick<IUser, 'email' | 'password'>): Promise<IUser | null> {
    const { email, password } = data;
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
    };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
  async verifyToken(token: string): Promise<string | JwtPayload | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
