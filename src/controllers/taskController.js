// src/controllers/taskController.js

const {
  createTask,
  updateTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTaskStatus,
} = require("../services/taskService");
const taskSchema = require("../validators/taskValidator").taskSchema;
const { Task, Status } = require("../models");

// Créer une tâche
exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenu du token JWT
    const { error, value } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Invalid data",
        details: error.details[0].message,
      });
    }

    const task = await createTask(value, userId);
    return res.status(201).json(task);
  } catch (err) {
    console.error("Erreur dans createTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la création de la tâche",
      error: err.message,
    });
  }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const {
      completed,
      sort = "createdAt",
      order = "DESC",
      offset = 0,
      limit = 10,
    } = req.query;

    // Récupérer l'userId depuis le token JWT
    const userId = req.user.id;

    const tasks = await getAllTasks(
      userId,
      completed,
      sort,
      order,
      offset,
      limit
    );
    return res.status(200).json(tasks || []);
  } catch (err) {
    console.error("Erreur dans getAllTasks:", err);
    return res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: err.message,
    });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await getTaskById(id, userId);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    return res.status(200).json(task);
  } catch (err) {
    console.error("Erreur dans getTaskById:", err);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la tâche",
      error: err.message,
    });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Invalid data",
        details: error.details[0].message,
      });
    }

    const task = await updateTask(id, value);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    console.log("Tâche mise à jour:", task);
    return res.status(200).json(task);
  } catch (err) {
    console.error("Erreur dans updateTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de la tâche",
      error: err.message,
    });
  }
};

// Mettre à jour le statut d'une tâche
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Vérifier d'abord que la tâche appartient à l'utilisateur
    const task = await getTaskById(id, userId);
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Mettre à jour le statut
    const updatedTask = await updateTask(id, { status }, userId);
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Erreur dans updateTaskStatus:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const success = await deleteTask(id, userId);
    if (!success) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    return res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    console.error("Erreur dans deleteTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: err.message,
    });
  }
};
