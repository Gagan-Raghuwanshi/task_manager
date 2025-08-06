const { Task } = require("../models");

exports.getTasks = async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.user.id } });
  res.json(tasks);
};

exports.create = async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.update(req.body);
  res.json(task);
};

exports.remove = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.destroy();
  res.json({ message: "Task deleted" });
};
