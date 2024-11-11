import request from 'supertest';
import mongoose from 'mongoose';
import { Server } from 'http';
import app from '../src/app';
import User from '../src/models/User';
import connectDB from '../src/utils/db';


let server: Server;
let port: number;

beforeAll(async () => {
  port = Math.floor(Math.random() * 10000) + 3000;
  server = app.listen(port, () => console.log(`Test server running on port ${port}`));
  await connectDB(false);
});

afterEach(async () => {
  await User.deleteMany({}); // Clear users after each test
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

it('should register a new user', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'password123' });

  expect(res.statusCode).toEqual(201);
  expect(res.body).toHaveProperty('_id');
  expect(res.body).toHaveProperty('email', 'test@example.com');
});

it('should not allow registration with an existing email', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'password123' });

  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'password123' });

  expect(res.statusCode).toEqual(400);
  expect(res.body).toHaveProperty('message');
});

it('should log in an existing user', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'password123' });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });

  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('token');
});

it('should not log in with invalid credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'wrong@example.com', password: 'wrongpassword' });

  expect(res.statusCode).toEqual(401);
  expect(res.body).toHaveProperty('message', 'Invalid credentials');
});

