import express, { Application, Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import listEndPoints from 'list_end_points';
import config from './config/config';
import { CustomError } from './helpers/error';
import { sendResponse } from './helpers/response';
import { connect } from './infra/db/mongoose/models';
import { configureContainer } from './config/container';
import UserService from './services/userService';
import UserController from './controllers/userController';

const app: Application = express();
const container = configureContainer();

// Connect to MongoDB
connect();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use((req, _, next) => {
  req.container = container;
  next();
});

// Use the user routes
app.use('/v1/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return sendResponse({
      res,
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  console.error(err.stack);
  return sendResponse({
    res,
    statusCode: 500,
    message: 'Something went wrong',
  });
});
listEndPoints(app);
export default app;
