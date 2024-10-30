const request = require("supertest");
const app = require("../../src/app");
const Task = require("../../src/models/Task");
const jwt = require("jsonwebtoken");

const authToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || "test-secret");

describe("TaskController", () => {
  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await Task.destroy({ where: {} });
  });

  // Test pour la création d'une tâche valide
  it("should create a new task with valid data", async () => {
    const validTask = {
      title: "Nouvelle tâche",
      description: "Description de la tâche",
      status: "en_cours",
    };

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send(validTask);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(validTask.title);
    expect(response.body.status).toBe(validTask.status);
  });

  // Test pour les cas d'erreur de validation
  it("should handle validation error in createTask", async () => {
    const invalidTask = {
      // Données manquantes intentionnellement
      title: "",
      description: "",
      status: "invalid_status",
    };

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send(invalidTask);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Données invalides");
  });

  // Test pour getTaskById
  it("should get task by id", async () => {
    const task = await Task.create({
      title: "Test Task",
      description: "Description",
      status: "en_cours",
    });

    const response = await request(app)
      .get(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(task.id);
    expect(response.body.status).toBe("en_cours");
  });

  // Test pour updateTask
  it("should update task", async () => {
    const task = await Task.create({
      title: "Original Title",
      description: "Description",
      status: "en_cours",
    });

    const updatedData = {
      title: "Updated Title",
      description: "Updated Description",
      status: "terminé",
    };

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.status).toBe(updatedData.status);
  });

  // Test pour deleteTask
  it("should delete task", async () => {
    const task = await Task.create({
      title: "To Delete",
      description: "Description",
      status: "en_cours",
    });

    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    // Vérifier que la tâche a bien été supprimée
    const deletedTask = await Task.findByPk(task.id);
    expect(deletedTask).toBeNull();
  });

  // Test pour getAllTasks
  it("should get all tasks", async () => {
    // Créer quelques tâches de test
    await Task.bulkCreate([
      {
        title: "Task 1",
        description: "Description 1",
        status: "en_cours",
      },
      {
        title: "Task 2",
        description: "Description 2",
        status: "terminé",
      },
    ]);

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  // Test pour la gestion des erreurs d'authentification
  it("should require authentication", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", "Bearer invalid_token");

    expect(response.status).toBe(403);
  });
});
