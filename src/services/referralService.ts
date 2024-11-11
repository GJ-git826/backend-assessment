import User, { IUser } from '../models/User';
import { hashPassword } from '../utils/hash';

// Helper function to create a unique referral code
const createUniqueReferralCode = (userId: string): string => {
  return `${userId.slice(0, 6)}-${Date.now().toString(36)}`; // e.g., "abc123-xyz"
};

// Generate a referral code for a specific user
export const generateReferralCode = async (userId: string): Promise<string> => {
  const referralCode = createUniqueReferralCode(userId);
  
  // Update the user with the new referral code
  await User.findByIdAndUpdate(userId, { referralCode });
  return referralCode;
};

// Register a new user using a referral code
export const registerWithReferral = async (email: string, password: string, referralCode: string) => {
  const referredByUser = await User.findOne({ referralCode });
  if(!referredByUser) {
    throw new Error('Invalid referral code');
  }
  const user = new User({
    email,
    passwordHash: await hashPassword(password),
    referredBy: referredByUser._id,
  });

  await user.save();
  return user;
}
