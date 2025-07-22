import {
  generateEmbeddings,
  generateEmbedding,
  findRelevantContent,
} from "@/lib/ai/embedding";

// Mock the AI SDK
jest.mock("ai", () => ({
  embed: jest.fn(),
  embedMany: jest.fn(),
}));

// Mock the Google AI SDK
jest.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: jest.fn(() => ({
    embedding: jest.fn(() => "mocked-embedding-model"),
  })),
}));

// Mock the database
jest.mock("@/lib/db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnValue([]),
  },
}));

// Mock drizzle operations
jest.mock("drizzle-orm", () => ({
  cosineDistance: jest.fn(),
  desc: jest.fn(),
  gt: jest.fn(),
  sql: jest.fn(),
}));

const { embed, embedMany } = require("ai");

describe("Embedding Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateEmbeddings", () => {
    it("should generate embeddings for chunked text", async () => {
      const mockEmbeddings = [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ];

      embedMany.mockResolvedValue({
        embeddings: mockEmbeddings,
      });

      const input = "This is sentence one. This is sentence two.";
      const result = await generateEmbeddings(input);

      expect(embedMany).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        values: ["This is sentence one", "This is sentence two"],
      });

      expect(result).toEqual([
        { content: "This is sentence one", embedding: [0.1, 0.2, 0.3] },
        { content: "This is sentence two", embedding: [0.4, 0.5, 0.6] },
      ]);
    });

    it("should handle empty input", async () => {
      embedMany.mockResolvedValue({
        embeddings: [],
      });

      const result = await generateEmbeddings("");
      expect(result).toEqual([]);
    });

    it("should handle single sentence", async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];

      embedMany.mockResolvedValue({
        embeddings: [mockEmbedding],
      });

      const input = "Single sentence";
      const result = await generateEmbeddings(input);

      expect(result).toEqual([
        { content: "Single sentence", embedding: [0.1, 0.2, 0.3] },
      ]);
    });

    it("should filter out empty chunks", async () => {
      embedMany.mockResolvedValue({
        embeddings: [[0.1, 0.2, 0.3]],
      });

      const input = "Valid sentence. . .";
      const result = await generateEmbeddings(input);

      expect(embedMany).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        values: ["Valid sentence"],
      });

      expect(result).toEqual([
        { content: "Valid sentence", embedding: [0.1, 0.2, 0.3] },
      ]);
    });
  });

  describe("generateEmbedding", () => {
    it("should generate single embedding", async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];

      embed.mockResolvedValue({
        embedding: mockEmbedding,
      });

      const input = "Test input with\nnewlines";
      const result = await generateEmbedding(input);

      expect(embed).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        value: "Test input with newlines",
      });

      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it("should replace newlines with spaces", async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];

      embed.mockResolvedValue({
        embedding: mockEmbedding,
      });

      const input = "Line one\nLine two\nLine three";
      await generateEmbedding(input);

      expect(embed).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        value: "Line one Line two Line three",
      });
    });
  });

  describe("findRelevantContent", () => {
    it("should find relevant content based on similarity", async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockResults = [
        { name: "Relevant content 1", similarity: 0.8 },
        { name: "Relevant content 2", similarity: 0.7 },
      ];

      embed.mockResolvedValue({
        embedding: mockEmbedding,
      });

      // Mock the database chain
      const mockDb = require("@/lib/db").db;
      mockDb.limit.mockResolvedValue(mockResults);

      const result = await findRelevantContent("test query");

      expect(embed).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        value: "test query",
      });

      expect(result).toEqual(mockResults);
    });

    it("should handle empty query", async () => {
      const mockEmbedding = [0, 0, 0];

      embed.mockResolvedValue({
        embedding: mockEmbedding,
      });

      const mockDb = require("@/lib/db").db;
      mockDb.limit.mockResolvedValue([]);

      const result = await findRelevantContent("");
      expect(result).toEqual([]);
    });

    it("should limit results to 4 items", async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];

      embed.mockResolvedValue({
        embedding: mockEmbedding,
      });

      const mockDb = require("@/lib/db").db;
      mockDb.limit.mockResolvedValue([]);

      await findRelevantContent("test query");

      expect(mockDb.limit).toHaveBeenCalledWith(4);
    });
  });

  describe("error handling", () => {
    it("should handle embedding API errors", async () => {
      embed.mockRejectedValue(new Error("API Error"));

      await expect(generateEmbedding("test")).rejects.toThrow("API Error");
    });

    it("should handle database errors in findRelevantContent", async () => {
      embed.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });

      const mockDb = require("@/lib/db").db;
      mockDb.limit.mockRejectedValue(new Error("Database Error"));

      await expect(findRelevantContent("test")).rejects.toThrow(
        "Database Error"
      );
    });
  });
});
