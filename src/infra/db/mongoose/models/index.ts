import mongoose from "mongoose";
import config from "../../../../config/config";

export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(config.db.url, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log("Connected to MongoDB".yellow.underline.bold);
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};

export const disconnect = async (): Promise<void> => {
  await mongoose.connection.close();
};
