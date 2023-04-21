import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Add any other test setup code here
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app';

describe('User routes', () => {
  describe('POST /register', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'Password123@' })
        .expect(201);
      //   expect(response.body).to.have.property('email', 'test@example.com');
    });
  });

  // Add any other tests for other routes here
});
