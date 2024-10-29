// src/controllers/taskController.js

const {
  createTask,
  updateTask,
  getAllTasks,
  getTaskById,
  deleteTask,
} = require("../services/taskService");
const { taskSchema } = require("../validators/taskValidator"); // Import du schéma de validation

// Créer une tâche
exports.createTask = async (req, res) => {
  const { error, value } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const task = await createTask(value);
    res.status(201).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la tâche", error: err });
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
    const tasks = await getAllTasks(completed, sort, order, offset, limit);
    return res.status(200).json(tasks);
  } catch (err) {
    console.error("Erreur dans getAllTasks controller:", err);
    return res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: err.message,
    });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await getTaskById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la tâche",
      error: err,
    });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { error, value } = taskSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const task = await updateTask(id, value);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la tâche",
      error: err,
    });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await deleteTask(id);
    if (success) {
      res.json({ message: "Tâche supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: err,
    });
  }
};
