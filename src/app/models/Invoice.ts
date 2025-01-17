import mongoose, { Schema, Document, Types } from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);

export interface InvoiceDocument extends Document {
  customer_id: Types.ObjectId;
  amount: number;
  date: Date;
  status: 'pending' | 'paid';
}

const InvoiceSchema = new Schema<InvoiceDocument>({
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    required: true,
  },
});

const Invoice =
  mongoose.models.Invoice ||
  mongoose.model<InvoiceDocument>('Invoice', InvoiceSchema);
export default Invoice;
