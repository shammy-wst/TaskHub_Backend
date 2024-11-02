// First, setup the mocks
jest.mock("../../../src/services/taskService");
jest.mock("../../../src/models");

// Then require the modules
const taskController = require("../../../src/controllers/taskController");
const taskService = require("../../../src/services/taskService");

describe("TaskController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup request mock
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 },
    };

    // Setup response mock
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      const taskId = 1;
      const updateData = {
        title: "Updated Task",
        description: "Updated Description",
        status: "en_cours",
      };
      mockReq.params.id = taskId;
      mockReq.body = updateData;

      const mockUpdatedTask = {
        id: taskId,
        ...updateData,
        userId: 1,
      };

      taskService.updateTask.mockResolvedValue(mockUpdatedTask);

      await taskController.updateTask(mockReq, mockRes);

      expect(taskService.updateTask).toHaveBeenCalledWith(taskId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it("should handle task not found", async () => {
      mockReq.params.id = 999;
      mockReq.body = {
        title: "Updated Task",
        description: "Updated Description",
        status: "en_cours",
      };
      mockReq.user = { id: 1 };

      taskService.updateTask.mockResolvedValue(null);

      await taskController.updateTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Tâche non trouvée",
      });
    });
  });

  describe("getAllTasks", () => {
    it("should get all tasks with pagination", async () => {
      mockReq.query = { page: "1", limit: "10" };

      const mockTasks = [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
      ];
      const mockPagination = {
        tasks: mockTasks,
        totalPages: 1,
        currentPage: 1,
      };

      taskService.getAllTasks.mockResolvedValue(mockPagination);

      await taskController.getAllTasks(mockReq, mockRes);

      expect(taskService.getAllTasks).toHaveBeenCalledWith(
        1,
        undefined,
        "createdAt",
        "DESC",
        0,
        "10"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPagination);
    });

    it("should handle service error", async () => {
      mockReq.query = { page: "1", limit: "10" };
      taskService.getAllTasks.mockRejectedValue(new Error("Service error"));

      await taskController.getAllTasks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération des tâches",
        error: "Service error",
      });
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status successfully", async () => {
      const taskId = 1;
      const newStatus = "terminé";
      mockReq.params.id = taskId;
      mockReq.body = { status: newStatus };
      mockReq.user = { id: 1 };

      const mockTask = {
        id: taskId,
        status: "en_cours",
        userId: 1,
      };

      // Mock du service getTaskById et updateTask
      taskService.getTaskById.mockResolvedValue(mockTask);
      taskService.updateTask.mockResolvedValue({
        ...mockTask,
        status: newStatus,
      });

      await taskController.updateTaskStatus(mockReq, mockRes);

      expect(taskService.getTaskById).toHaveBeenCalledWith(
        taskId,
        mockReq.user.id
      );
      expect(taskService.updateTask).toHaveBeenCalledWith(
        taskId,
        { status: newStatus },
        mockReq.user.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        ...mockTask,
        status: newStatus,
      });
    });

    it("should handle task not found", async () => {
      mockReq.params.id = 999;
      mockReq.body = { status: "en_cours" };
      mockReq.user = { id: 1 };

      taskService.getTaskById.mockResolvedValue(null);

      await taskController.updateTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Tâche non trouvée",
      });
    });

    it("should handle service error", async () => {
      mockReq.params.id = 1;
      mockReq.body = { status: "terminé" };
      mockReq.user = { id: 1 };

      taskService.getTaskById.mockRejectedValue(new Error("Service error"));

      await taskController.updateTaskStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Service error",
      });
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      const newTask = {
        title: "New Task",
        description: "Description",
        status: "en_cours",
      };
      mockReq.body = newTask;

      const createdTask = { id: 1, ...newTask, userId: 1 };
      taskService.createTask.mockResolvedValue(createdTask);

      await taskController.createTask(mockReq, mockRes);

      expect(taskService.createTask).toHaveBeenCalledWith(
        newTask,
        mockReq.user.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdTask);
    });

    it("should handle validation error", async () => {
      const invalidTask = {
        title: "", // titre invalide
        status: "invalid_status",
      };
      mockReq.body = invalidTask;

      await taskController.createTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid data",
        details: expect.any(String),
      });
    });

    it("should handle service error", async () => {
      const newTask = {
        title: "New Task",
        description: "Description",
        status: "en_cours",
      };
      mockReq.body = newTask;
      mockReq.user = { id: 1 };

      taskService.createTask.mockRejectedValue(new Error("Service error"));

      await taskController.createTask(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Erreur lors de la création de la tâche",
        error: "Service error",
      });
    });
  });

  describe("getTaskById", () => {
    it("should handle service error", async () => {
      mockReq.params.id = 1;
      taskService.getTaskById.mockRejectedValue(new Error("Service error"));

      await taskController.getTaskById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération de la tâche",
        error: "Service error",
      });
    });
  });
});
