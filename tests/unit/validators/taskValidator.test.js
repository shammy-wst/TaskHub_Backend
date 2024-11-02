const taskSchema = require("../../../src/schemas/taskSchema");

describe("Task Validator", () => {
  describe("validateTask", () => {
    it("should validate a correct task", () => {
      const validTask = {
        title: "Test Task",
        description: "This is a valid task description",
        status: "en_cours",
      };

      const { error } = taskSchema.validate(validTask);
      expect(error).toBeUndefined();
    });

    it("should reject task with invalid title", () => {
      const invalidTask = {
        title: "",
        description: "Description valide",
        status: "en_cours",
      };

      const { error } = taskSchema.validate(invalidTask);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("titre");
    });

    it("should reject task with invalid status", () => {
      const invalidTask = {
        title: "Titre valide",
        description: "Description valide",
        status: "invalid_status",
      };

      const { error } = taskSchema.validate(invalidTask);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain("status");
    });
  });
});
