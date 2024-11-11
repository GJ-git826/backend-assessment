import User, { IUser } from '../models/User';
import { hashPassword, verifyPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export const registerUser = async (email: string, password: string): Promise<IUser> => {
  const passwordHash = await hashPassword(password)
  const user = new User({ email, passwordHash });
  return await user.save();
};

export const loginUser = async (email: string, password: string): Promise<string | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) return null;

  return generateToken(user._id);
};
