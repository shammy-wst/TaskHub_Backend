// src/services/taskService.js
const Task = require("../models/Task");
const { Op, Sequelize } = require("sequelize");

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.getAllTasks = async (
  completed,
  sort = "createdAt",
  order = "DESC",
  offset = 0,
  limit = 10
) => {
  try {
    const where = {};
    if (completed !== undefined) {
      where.completed = completed === "true";
    }

    const tasks = await Task.findAll({
      where,
      order: [[sort, order]],
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    return tasks;
  } catch (error) {
    console.error("Erreur dans getAllTasks:", error);
    throw error;
  }
};

exports.getTaskById = async (id) => {
  return await Task.findByPk(id);
};

exports.updateTask = async (id, taskData) => {
  const task = await Task.findByPk(id);
  if (task) {
    await task.update(taskData);
  }
  return task;
};

exports.deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (task) {
    await task.destroy();
    return true;
  }
  return false;
};
