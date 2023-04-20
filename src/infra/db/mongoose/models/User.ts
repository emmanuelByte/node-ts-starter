import { Schema, model, Document } from 'mongoose';

export enum REGISTRATION_STATUS {
  SIGN_UP = 'SIGN_UP', //Initial
  VERIFY = 'VERIFY', // Account has been verify
  DATA_VERIFY = 'DATA_VERIFY', // Data Has Been Inputted
  PIN = 'PIN', // Pin has been added
}

export interface IUser extends Document {
  email: string;
  password: string | undefined;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  verification?: {
    code?: string;
    isVerified: boolean;
  };
  resetPassword?: {
    code: string;
    isReset: boolean;
  };
  registrationStatus: REGISTRATION_STATUS;
}
interface REGISTRATION_STATUS_INDEX {
  [key: number]: REGISTRATION_STATUS;
}

const registrationStatusIndex: REGISTRATION_STATUS_INDEX = {
  0: REGISTRATION_STATUS.SIGN_UP,
  1: REGISTRATION_STATUS.VERIFY,
  2: REGISTRATION_STATUS.DATA_VERIFY,
  3: REGISTRATION_STATUS.PIN,
};
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    verification: {
      code: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    resetPassword: {
      code: String,
      isReset: Boolean,
    },
    registrationStatus: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.SIGN_UP,
      required: true,
      get: (value: number) => registrationStatusIndex[value],
    },
  },
  {
    timestamps: true,
  },
);

const User = model<IUser>('User', userSchema);
export default User;
