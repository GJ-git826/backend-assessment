import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';
import { generateToken } from '../src/utils/jwt';

describe('Referral Endpoints', () => {
  let userId: string;
  let token: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);

    // Create a user and get their token
    const user = await User.create({ email: 'referrer@example.com', passwordHash: 'hashedpassword' });
    userId = user._id.toString();
    token = generateToken(userId);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('should generate a referral code for an authenticated user', async () => {
    const res = await request(app)
      .post('/api/referral/generate')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('referralCode');
  });

  it('should register a new user with a referral code', async () => {
    // Generate a referral code
    const referralRes = await request(app)
      .post('/api/referral/generate')
      .set('Authorization', `Bearer ${token}`);
    
    const referralCode = referralRes.body.referralCode;

    // Register a new user with the referral code
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'newuser@example.com', password: 'password123', referralCode });

    expect(registerRes.statusCode).toEqual(201);
    expect(registerRes.body).toHaveProperty('_id');
    expect(registerRes.body).toHaveProperty('referredBy', userId);
  });
});
