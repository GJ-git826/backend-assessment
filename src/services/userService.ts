import User, { IUser } from '../models/User';

export const getAllUsers = async (page: number, limit: number): Promise<{ users: IUser[], total: number }> => {
  const total = await User.countDocuments(); // Total number of users for pagination
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-passwordHash'); // Exclude sensitive fields like passwordHash
  
  return { users, total };
};
