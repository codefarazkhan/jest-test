import request from 'supertest';
import mongoose from 'mongoose';
import app from './app';

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://root:Nodejs%40123@cluster0.vrvpvgg.mongodb.net/jest-test');
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

let userId: string;

describe('User CRUD API', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('John Doe');
    userId = res.body._id;
  });

  it('should get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single user by ID', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .send({ name: 'Jane Doe' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Jane Doe');
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(204);
  });
});
