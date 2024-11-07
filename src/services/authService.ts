import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const registerUser = async (email: string, password: string): Promise<IUser> => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash });
  return await user.save();
};

export const loginUser = async (email: string, password: string): Promise<string | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
