import mongoose, { Schema, Document } from 'mongoose';

export interface RevenueDocument extends Document {
  month: string;
  revenue: number;
}

const RevenueSchema = new Schema<RevenueDocument>({
  month: {
    type: String,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
});

const Revenue =
  mongoose.models.Revenue ||
  mongoose.model<RevenueDocument>('Revenue', RevenueSchema);
export default Revenue;
