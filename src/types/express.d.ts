import { AwilixContainer } from 'awilix';
import { IUser } from '../infra/db/mongoose/models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    container?: AwilixContainer<{ [key as string]: unknown }>;
  }
}
