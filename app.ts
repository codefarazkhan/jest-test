import express from 'express';
import mongoose, { Schema, model } from 'mongoose';

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://root:Nodejs%40123@cluster0.vrvpvgg.mongodb.net/jest-test');
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});


// Schema and Model
const userSchema = new Schema({
  name: String,
  email: String,
});

const User = model('User', userSchema);

// Create
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// Read All
app.get('/users', async (_req, res) => {
  const users = await User.find();
  res.json(users);
});

// Read One
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.sendStatus(404);
  res.json(user);
});

// Update
app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.sendStatus(404);
  res.json(user);
});

// Delete
app.delete('/users/:id', async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  if (!result) return res.sendStatus(404);
  res.sendStatus(204);
});

// Start server if not in test
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}

export default app;
