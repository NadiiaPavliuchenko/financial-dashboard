import mongoose, { Schema, Document, Types } from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User =
  mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
export default User;
