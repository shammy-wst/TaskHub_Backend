// src/services/taskService.js
const Task = require("../models/Task");
const { literal } = require("sequelize");

exports.createTask = async (taskData) => {
  return await Task.create(taskData);
};

exports.getAllTasks = async (completed, sort, order, offset, limit) => {
  const orderDirection = order === "DESC" ? "DESC" : "ASC";
  const queryOptions = {
    where: completed ? { completed } : {},
    order: [[literal(sort), orderDirection]], // Utilisation de Sequelize.literal pour `order`
    offset,
    limit,
  };

  return await Task.findAll(queryOptions);
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
