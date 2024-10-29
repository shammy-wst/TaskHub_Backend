// src/controllers/taskController.js
const taskService = require("../services/taskService");

exports.createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const task = await taskService.createTask({
      title,
      description,
      completed,
    });
    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la tâche", error });
  }
};

exports.getAllTasks = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "ASC",
    completed,
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    const tasks = await taskService.getAllTasks(
      completed,
      sort.toString(),
      order.toString().toUpperCase(),
      offset.toString(),
      limit.toString()
    );
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskService.getTaskById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la tâche", error });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const task = await taskService.getTaskById(id);
    if (task) {
      task.setDataValue("title", title);
      task.setDataValue("description", description);
      task.setDataValue("completed", completed);
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la tâche", error });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await taskService.deleteTask(id);
    if (result) {
      res.json({ message: "Tâche supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la tâche", error });
  }
};
