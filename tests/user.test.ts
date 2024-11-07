import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User';
import { generateToken } from '../src/utils/jwt';

describe('User Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  });

  afterEach(async () => {
    await User.deleteMany(); // Clear users after each test
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should get a list of users with pagination', async () => {
    // Seed database with some users
    await User.create([
      { email: 'user1@example.com', passwordHash: 'hashedpassword1' },
      { email: 'user2@example.com', passwordHash: 'hashedpassword2' },
      { email: 'user3@example.com', passwordHash: 'hashedpassword3' }
    ]);

    // Generate a valid token for an authenticated request
    const token = generateToken('adminUserId'); // Replace with actual userId if needed

    const res = await request(app)
      .get('/api/admin/users?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body.users.length).toBeLessThanOrEqual(2); // Ensure pagination is respected
    expect(res.body).toHaveProperty('total');
  });

  it('should return unauthorized without a token', async () => {
    const res = await request(app)
      .get('/api/admin/users?page=1&limit=2');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
