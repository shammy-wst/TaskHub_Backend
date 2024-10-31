// src/routes/taskRoutes.js

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/authMiddleware");

// Créer une nouvelle tâche
router.post("/", authenticateToken, taskController.createTask);

// Récupérer toutes les tâches avec pagination, tri et filtrage
router.get("/", authenticateToken, taskController.getAllTasks);

// Récupérer une tâche par ID
router.get("/:id", authenticateToken, taskController.getTaskById);

// Mettre à jour une tâche
router.put("/:id", authenticateToken, taskController.updateTask);

// Mettre à jour le statut d'une tâche
router.patch("/status/:id", authenticateToken, taskController.updateTaskStatus);

// Supprimer une tâche
router.delete("/:id", authenticateToken, taskController.deleteTask);

module.exports = router;
