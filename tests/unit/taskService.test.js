/** @jest-environment node */
const taskService = require("../../src/services/taskService");
const Task = require("../../src/models/Task");

jest.mock("../../src/models/Task", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        completed: false,
      };

      Task.create.mockResolvedValue(taskData);

      const result = await taskService.createTask(taskData);
      expect(Task.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(taskData);
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks with filters", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
      ];

      Task.findAll.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks(
        true,
        "createdAt",
        "DESC",
        0,
        10
      );
      expect(Task.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });
});
