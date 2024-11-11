import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';
import { hashPassword } from '../src/utils/hash';
import mongoose from 'mongoose';
import { Server } from 'http';
import connectDB from '../src/utils/db';

let server: Server;
let port: number;
let userId: string;
let referralCode: string;

beforeAll(async () => {
  port = Math.floor(Math.random() * 10000) + 3000;
  server = app.listen(port, () => console.log(`Test server running on port ${port}`));
  await connectDB(false);

  const referringUser = await User.create({
    email: 'existinguser@example.com',
    passwordHash: await hashPassword('existingpassword'),
    referralCode: 'VALID_REFERRAL_CODE',
  });

  userId = referringUser._id.toString();
  referralCode = referringUser.referralCode!;
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

test('should register a new user with a referral code', async () => {
  const registerRes = await request(app)
    .post(`/api/auth/register`)
    .send({ email: 'newuser@example.com', password: 'password123', referralCode });

  expect(registerRes.statusCode).toEqual(201);
  expect(registerRes.body).toHaveProperty('_id');
  expect(registerRes.body).toHaveProperty('referredBy', userId);
});
