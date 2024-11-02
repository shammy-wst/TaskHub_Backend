const { Task } = require("../models");

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
      where: {
        id,
        userId,
      },
    });
    if (!task) {
      return null;
    }
    await task.update(taskData);
    console.log("Task updated:", task);
    return task;
  } catch (error) {
    console.error("Erreur dans updateTask:", error);
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
      return null;
    }
    task.status = status;
    await task.save();
    return task;
  } catch (error) {
    console.error("Erreur dans updateTaskStatus:", error);
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
