import mongoose, { Schema, Document } from 'mongoose';

export interface CustomerDocument extends Document {
  name: string;
  email: string;
  image_url: string;
}

const CustomerSchema = new Schema<CustomerDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});

const Customer =
  mongoose.models.Customer ||
  mongoose.model<CustomerDocument>('Customer', CustomerSchema);
export default Customer;
