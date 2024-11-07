import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  referralCode?: string;
  referredBy?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  referralCode: { type: String, unique: true },    // Unique referral code for each user
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' } // References the user who referred them
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
