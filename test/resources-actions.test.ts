import { createResource } from "@/lib/actions/resources";
import { insertResourceSchema } from "@/lib/db/schema/resources";

// Mock the database
jest.mock("@/lib/db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

// Mock the embedding functions
jest.mock("@/lib/ai/embedding", () => ({
  generateEmbeddings: jest.fn(),
}));

// Mock the embeddings schema
jest.mock("@/lib/db/schema/embeddings", () => ({
  embeddings: "mocked-embeddings-table",
}));

const { db } = require("@/lib/db");
const { generateEmbeddings } = require("@/lib/ai/embedding");

describe("Resources Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createResource", () => {
    it("should create resource successfully", async () => {
      const mockResource = {
        id: "test-resource-id",
        content: "Test content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEmbeddings = [
        { content: "Test", embedding: [0.1, 0.2, 0.3] },
        { content: "content", embedding: [0.4, 0.5, 0.6] },
      ];

      db.returning.mockResolvedValue([mockResource]);
      generateEmbeddings.mockResolvedValue(mockEmbeddings);

      const result = await createResource({ content: "Test content" });

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith({ content: "Test content" });
      expect(db.returning).toHaveBeenCalled();
      expect(generateEmbeddings).toHaveBeenCalledWith("Test content");
      expect(result).toBe("Resource successfully created and embedded.");
    });

    it("should validate input using schema", async () => {
      const mockResource = {
        id: "test-resource-id",
        content: "Valid content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      db.returning.mockResolvedValue([mockResource]);
      generateEmbeddings.mockResolvedValue([]);

      await createResource({ content: "Valid content" });

      expect(db.values).toHaveBeenCalledWith({ content: "Valid content" });
    });

    it("should handle schema validation errors", async () => {
      // Test with invalid input (empty content)
      const result = await createResource({ content: "" });

      expect(result).toContain("Error");
      expect(db.insert).not.toHaveBeenCalled();
      expect(generateEmbeddings).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      db.returning.mockRejectedValue(new Error("Database connection failed"));

      const result = await createResource({ content: "Test content" });

      expect(result).toBe("Database connection failed");
    });

    it("should handle embedding errors", async () => {
      const mockResource = {
        id: "test-resource-id",
        content: "Test content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      db.returning.mockResolvedValue([mockResource]);
      generateEmbeddings.mockRejectedValue(new Error("Embedding API failed"));

      const result = await createResource({ content: "Test content" });

      expect(result).toBe("Embedding API failed");
    });

    it("should handle generic errors", async () => {
      db.returning.mockRejectedValue(new Error(""));

      const result = await createResource({ content: "Test content" });

      expect(result).toBe("Error, please try again.");
    });

    it("should create embeddings for resource", async () => {
      const mockResource = {
        id: "test-resource-id",
        content: "Test content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEmbeddings = [
        { content: "Test", embedding: [0.1, 0.2, 0.3] },
        { content: "content", embedding: [0.4, 0.5, 0.6] },
      ];

      db.returning.mockResolvedValue([mockResource]);
      generateEmbeddings.mockResolvedValue(mockEmbeddings);

      await createResource({ content: "Test content" });

      // Verify embeddings are inserted with resource ID
      expect(db.insert).toHaveBeenCalledTimes(2); // Once for resource, once for embeddings
      expect(generateEmbeddings).toHaveBeenCalledWith("Test content");
    });

    it("should handle missing content", async () => {
      const result = await createResource({} as any);

      expect(result).toContain("Error");
      expect(db.insert).not.toHaveBeenCalled();
    });

    it("should handle non-string content", async () => {
      const result = await createResource({ content: null as any });

      expect(result).toContain("Error");
      expect(db.insert).not.toHaveBeenCalled();
    });
  });

  describe("insertResourceSchema validation", () => {
    it("should validate correct input", () => {
      const validInput = { content: "Valid content" };
      const result = insertResourceSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("Valid content");
      }
    });

    it("should reject empty content", () => {
      const invalidInput = { content: "" };
      const result = insertResourceSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it("should reject missing content", () => {
      const invalidInput = {};
      const result = insertResourceSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });
  });
});
