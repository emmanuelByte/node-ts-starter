import express, { Application } from 'express';
import 'reflect-metadata';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

import notFoundHandler from './middlewares/notFoundHandler';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Use the user routes
app.use('/v1/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
