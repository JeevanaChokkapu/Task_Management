import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MONGODB_URI, PORT } from './config.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Task manager API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal error', error: err.message });
});

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
};

start();
