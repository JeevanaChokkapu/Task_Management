import express from 'express';
import Task from '../models/task.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Task creation failed', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'Done').length;
    const pending = tasks.filter((t) => t.status !== 'Done').length;
    const completionRate = total ? Math.round((done / total) * 100) : 0;

    res.json({ tasks, analytics: { total, done, pending, completionRate } });
  } catch (error) {
    res.status(500).json({ message: 'Fetch tasks failed', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Fetch task failed', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updates = (({ title, description, status, priority, dueDate }) => ({ title, description, status, priority, dueDate }))(req.body);
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updates, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

export default router;
