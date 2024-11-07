import User from '../models/User';
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
export const registerWithReferral = async (email: string, password: string, referralCode?: string) => {
  const user = new User({
    email,
    passwordHash: await hashPassword(password),
    referredBy: referralCode ? await getReferredByUserId(referralCode) : undefined,
  });
  return await user.save();
};

// Find the user ID of the user who owns a given referral code
const getReferredByUserId = async (referralCode: string): Promise<string | null> => {
  const user = await User.findOne({ referralCode });
  return user ? user._id.toString() : null;
};
