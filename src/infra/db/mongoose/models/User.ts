import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string | undefined;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  verification?: {
    emailVerification?: {
      code?: string;
      isVerified: boolean;
    };
    smsVerification?: {
      code?: string;
      isVerified: boolean;
    };
  };
  resetPassword?: {
    code?: string;
  };
  pin: string;
}
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    verification: {
      emailVerification: {
        code: String,
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
      smsVerification: {
        code: String,
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
    },
    resetPassword: {
      code: String,
      isReset: Boolean,
    },
    pin: { type: String },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>('User', userSchema);
export default User;
