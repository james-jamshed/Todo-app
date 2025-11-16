const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const q = req.query.q;
    const from = req.query.from;
    const to = req.query.to;

    let filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const tasks = await Task.find(filter).sort({ date: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, priority } = req.body;
    if (!title || !date) return res.status(400).json({ error: 'Title and date are required' });

    const t = new Task({
      title,
      description,
      date,
      startTime,
      endTime,
      priority
    });
    const saved = await t.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await Task.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Task.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
