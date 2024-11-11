// tests/user.test.ts

import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';
import { hashPassword } from '../src/utils/hash';
import mongoose from 'mongoose';
import { Server } from 'http';
import connectDB from '../src/utils/db';

let server: Server;
let port: number;

beforeAll(async () => {
  port = Math.floor(Math.random() * 10000) + 3000;
  server = app.listen(port, () => console.log(`Test server running on port ${port}`));
  await connectDB(false);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

test('should get a list of users with pagination', async () => {
  await User.create([
    { email: 'user1@example.com', passwordHash: await hashPassword('password1') },
    { email: 'user2@example.com', passwordHash: await hashPassword('password2') },
  ]);

  const response = await request(app)
    .get(`/api/users?page=1&limit=2`);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toHaveLength(2);
  expect(response.body[0]).toHaveProperty('email');
});
