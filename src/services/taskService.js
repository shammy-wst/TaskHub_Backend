const { Task } = require("../models");
const { Op, Sequelize } = require("sequelize");

// Créer une tâche
exports.createTask = async (taskData) => {
  try {
    const task = await Task.create(taskData);
    console.log("Tâche créée:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans createTask:", error);
    throw error;
  }
};

// Récupérer toutes les tâches
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

    console.log("Tâches récupérées:", tasks);
    return tasks;
  } catch (error) {
    console.error("Erreur dans getAllTasks:", error);
    throw error;
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (id) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error("Tâche non trouvée");
    }
    console.log("Tâche trouvée par ID:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans getTaskById:", error);
    throw error;
  }
};

// Mettre à jour une tâche
exports.updateTask = async (id, taskData) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return null;
    }

    await task.update(taskData);
    console.log("Tâche mise à jour:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans updateTask:", error);
    throw error;
  }
};

// Mettre à jour le statut d'une tâche
exports.updateTaskStatus = async (id, status) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return null;
    }

    await task.update({ status });
    console.log("Statut de la tâche mis à jour:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans updateTaskStatus:", error);
    throw error;
  }
};

// Supprimer une tâche
exports.deleteTask = async (id) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return false;
    }
    await task.destroy();
    console.log("Tâche supprimée:", id);
    return true;
  } catch (error) {
    console.error("Erreur dans deleteTask:", error);
    throw error;
  }
};
