// src/routes/taskRoutes.js

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Créer une nouvelle tâche
router.post("/", taskController.createTask);

// Récupérer toutes les tâches avec pagination, tri et filtrage
router.get("/", taskController.getAllTasks);

// Récupérer une tâche par ID
router.get("/:id", taskController.getTaskById);

// Mettre à jour une tâche
router.put("/:id", taskController.updateTask);

// Mettre à jour le statut d'une tâche (garder les deux routes)
router.patch("/status/:id", taskController.updateTaskStatus);
router.patch("/:id", taskController.updateTaskStatus);

// Supprimer une tâche
router.delete("/:id", taskController.deleteTask);

module.exports = router;
