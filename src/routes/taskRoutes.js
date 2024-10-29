const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticateToken = require("../middleware/authMiddleware");

// Créer une nouvelle tâche
router.post("/", authenticateToken, async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const task = await Task.create({ title, description, completed });
    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la tâche", error });
  }
});

// Récupérer toutes les tâches
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
});

// Récupérer une tâche par ID
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
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
});

// Mettre à jour une tâche
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const task = await Task.findByPk(id);
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
});

// Supprimer une tâche
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      await task.destroy();
      res.json({ message: "Tâche supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Tâche non trouvée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la tâche", error });
  }
});

module.exports = router;
