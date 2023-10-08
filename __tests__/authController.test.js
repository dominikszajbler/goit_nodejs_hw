const request = require('supertest');
const express = require('express');
const session = require('supertest-session');
const app = express();
const { User } = require('../models/userModel');

const authController = require('../routes/api/users');
app.use('/', authController);

describe('POST /signin', () => {
   jest.setTimeout(30000);

  it('should return a token and user object with email and subscription', async () => {
    try {
    const userData = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const newUser = new User(userData);
    await newUser.save();

    const res = await request(app)
      .post('/signin')
      .send(userData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email');
    expect(typeof res.body.user.email).toBe('string');
    expect(res.body.user).toHaveProperty('subscription');
    expect(typeof res.body.user.subscription).toBe('string');
  } catch (error) {
    throw error;
  }
});
});
