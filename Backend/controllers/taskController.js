const { Task } = require("../models");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" + error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" + error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.update(req.body);
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" + error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" + error.message });
  }
};
