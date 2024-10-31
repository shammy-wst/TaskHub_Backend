// src/services/taskService.js
const Task = require("../models/Task");
const { Op, Sequelize } = require("sequelize");

exports.createTask = async (taskData) => {
  try {
    const task = await Task.create(taskData);
    console.log("Tâche créée:", task); // Ajoutez ce log pour vérifier la tâche créée
    return task;
  } catch (error) {
    console.error("Erreur dans createTask:", error);
    throw error;
  }
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

    console.log("Tâches récupérées:", tasks); // Ajoutez ce log pour vérifier les tâches récupérées
    return tasks;
  } catch (error) {
    console.error("Erreur dans getAllTasks:", error);
    throw error;
  }
};
