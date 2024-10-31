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

// Créer une tâche
exports.createTask = async (req, res) => {
  try {
    // Validation des données
    const { error, value } = taskSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Données invalides",
        details: errors.join(", "),
      });
    }

    // Création de la tâche
    const task = await createTask(value);
    console.log("Tâche créée:", task);

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

    const tasks = await getAllTasks(completed, sort, order, offset, limit);
    console.log("Tâches renvoyées au client:", tasks);
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
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    console.log("Tâche récupérée par ID:", task);
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
        message: "Données invalides",
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

    const task = await updateTask(id, { status });

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    console.log("Statut de la tâche mis à jour:", task);
    return res.status(200).json(task);
  } catch (err) {
    console.error("Erreur dans updateTaskStatus:", err);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du statut de la tâche",
      error: err.message,
    });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteTask(id);

    if (!success) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    console.log("Tâche supprimée:", id);
    return res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    console.error("Erreur dans deleteTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: err.message,
    });
  }
};
