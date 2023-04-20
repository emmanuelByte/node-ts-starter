import { Schema, model, Document } from 'mongoose';

export interface IPin extends Document {
  userId: Schema.Types.ObjectId;
  code: string;
}

const PinSchema = new Schema<IPin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Pin = model<IPin>('Pin', PinSchema);
export default Pin;
