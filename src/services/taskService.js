const { Task } = require("../models");
const logger = require("../utils/logger");

// Créer une tâche
exports.createTask = async (taskData, userId) => {
  try {
    const task = await Task.create({
      ...taskData,
      userId,
    });
    console.log("Task created:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans createTask:", error);
    throw error;
  }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (
  userId,
  completed,
  sort = "createdAt",
  order = "DESC",
  offset = 0,
  limit = 10
) => {
  try {
    const where = { userId };
    if (completed !== undefined) {
      where.completed = completed === "true";
    }

    const tasks = await Task.findAll({
      where,
      order: [[sort, order]],
      offset: parseInt(offset),
      limit: parseInt(limit),
    });

    console.log("Tasks retrieved:", tasks);
    return tasks;
  } catch (error) {
    console.error("Erreur dans getAllTasks:", error);
    throw error;
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (id, userId) => {
  try {
    const task = await Task.findOne({
      where: {
        id,
        userId,
      },
    });
    if (!task) {
      throw new Error("Task not found");
    }
    console.log("Task found by ID:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans getTaskById:", error);
    throw error;
  }
};

// Mettre à jour une tâche
exports.updateTask = async (id, taskData, userId) => {
  try {
    const task = await Task.findOne({
      where: { id, userId },
    });
    if (!task) {
      logger.debug(`Tâche non trouvée pour mise à jour: ID ${id}`);
      return null;
    }
    const updatedTask = await task.update(taskData);
    logger.info(`Tâche ${id} mise à jour avec succès`);
    return updatedTask;
  } catch (error) {
    logger.error("Erreur lors de la mise à jour de la tâche:", error);
    throw error;
  }
};

// Mettre à jour le statut d'une tâche
exports.updateTaskStatus = async (id, status, userId) => {
  try {
    const task = await Task.findOne({
      where: { id, userId },
    });
    if (!task) {
      logger.debug(`Tâche non trouvée pour mise à jour du statut: ID ${id}`);
      return null;
    }
    task.status = status;
    const savedTask = await task.save();
    logger.info(`Statut de la tâche ${id} mis à jour: ${status}`);
    return savedTask;
  } catch (error) {
    logger.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
};

// Supprimer une tâche
exports.deleteTask = async (id, userId) => {
  try {
    const task = await Task.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return false;
    }

    await task.destroy();
    return true;
  } catch (error) {
    console.error("Erreur dans deleteTask:", error);
    throw error;
  }
};
