import mongoose from 'mongoose';
import config from '../../../../config/config';

export const connect = async (): Promise<void> => {
  try {
    const url = config.db.url as string;
    await mongoose.connect(url);
    console.log('Connected to MongoDB'.yellow.underline.bold);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const disconnect = async (): Promise<void> => {
  await mongoose.connection.close();
};
