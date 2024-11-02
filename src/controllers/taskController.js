const {
  createTask,
  updateTask,
  getAllTasks,
  getTaskById,
  deleteTask,
} = require("../services/taskService");

const { taskSchema } = require("../validators/taskValidator");
const { Task } = require("../models");
const logger = require("../utils/logger");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error, value } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Invalid data",
        details: error.details[0].message,
      });
    }

    // S'assurer que le status initial est "en_attente"
    value.status = "en_attente";

    const task = await createTask(value, userId);
    return res.status(201).json(task);
  } catch (err) {
    logger.error("Erreur dans createTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la création de la tâche",
      error: err.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const {
      completed,
      sort = "createdAt",
      order = "DESC",
      offset = 0,
      limit = 10,
    } = req.query;

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
    logger.error("Erreur dans getAllTasks:", err);
    return res.status(500).json({
      message: "Erreur lors de la récupération des tâches",
      error: err.message,
    });
  }
};

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
    logger.error("Erreur dans getTaskById:", err);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la tâche",
      error: err.message,
    });
  }
};

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
    logger.error("Erreur dans updateTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de la tâche",
      error: err.message,
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ["en_attente", "en_cours", "terminé"];
    if (!validStatuses.includes(status)) {
      logger.debug("Statut invalide reçu:", status);
      return res.status(400).json({
        message:
          "Statut invalide. Les valeurs possibles sont: en_attente, en_cours, terminé",
      });
    }

    const task = await Task.findOne({
      where: { id, userId },
    });

    if (!task) {
      logger.debug(`Tâche non trouvée: ID ${id}, UserID ${userId}`);
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    const updatedTask = await task.update({ status });
    logger.info(`Tâche ${id} mise à jour: ${status}`);
    return res.status(200).json(updatedTask);
  } catch (error) {
    logger.error("Erreur lors de la mise à jour du statut:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

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
    logger.error("Erreur dans deleteTask:", err);
    return res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: err.message,
    });
  }
};
