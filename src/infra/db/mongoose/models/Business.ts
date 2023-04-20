import mongoose, { Schema, model, Document } from 'mongoose';

export interface IBusiness extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  sector: string;
  address: string;
}

const businessSchema = new Schema<IBusiness>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    sector: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Business = model<IBusiness>('Business', businessSchema);
export default Business;
