// src/services/userService.ts

import User, { IUser } from '../models/User';
import { hashPassword } from '../utils/hash';
import mongoose from 'mongoose';

interface CreateUserDto {
  email: string;
  password: string;
  referralCode?: string;
  referredBy?: mongoose.Schema.Types.ObjectId;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

export class UserService {
  
  // Get a list of users with pagination
  async getUsers({ page = 1, limit = 10 }: PaginationOptions): Promise<IUser[]> {
    return await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
  }

  // Additional function: Find a user by email (for login or authentication checks)
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
}

export default new UserService();
