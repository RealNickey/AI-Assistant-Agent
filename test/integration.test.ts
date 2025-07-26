/**
 * Integration tests for the AI Assistant Agent
 * These tests verify that different parts of the system work together correctly
 */

// Mock all external dependencies
jest.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: jest.fn(() => ({
    embedding: jest.fn(() => "mocked-embedding-model"),
    "gemini-2.5-flash": "mocked-chat-model",
  })),
}));

jest.mock("ai", () => ({
  embed: jest.fn(),
  embedMany: jest.fn(),
  streamText: jest.fn(),
  tool: jest.fn((config) => config),
  generateObject: jest.fn(),
}));

jest.mock("@/lib/db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn(),
  },
}));

jest.mock("drizzle-orm", () => ({
  cosineDistance: jest.fn(),
  desc: jest.fn(),
  gt: jest.fn(),
  sql: jest.fn(),
}));

const { embed, embedMany, streamText, generateObject } = require("ai");
const { db } = require("@/lib/db");

describe("Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("End-to-End Resource Creation and Retrieval", () => {
    it("should create a resource and make it searchable", async () => {
      const { createResource } = await import("@/lib/actions/resources");
      const { findRelevantContent } = await import("@/lib/ai/embedding");

      // Mock resource creation
      const mockResource = {
        id: "test-resource-id",
        content: "Test content about artificial intelligence",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEmbeddings = [
        { content: "Test content", embedding: [0.1, 0.2, 0.3] },
        { content: "artificial intelligence", embedding: [0.4, 0.5, 0.6] },
      ];

      db.returning.mockResolvedValue([mockResource]);
      embedMany.mockResolvedValue({
        embeddings: [
          [0.1, 0.2, 0.3],
          [0.4, 0.5, 0.6],
        ],
      });

      // Create resource
      const createResult = await createResource({
        content: "Test content about artificial intelligence",
      });

      expect(createResult).toBe("Resource successfully created and embedded.");
      expect(db.insert).toHaveBeenCalledTimes(2); // Resource + embeddings

      // Mock search
      embed.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });
      db.limit.mockResolvedValue([
        { name: "Test content", similarity: 0.8 },
        { name: "artificial intelligence", similarity: 0.7 },
      ]);

      // Search for content
      const searchResult = await findRelevantContent("AI information");

      expect(embed).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        value: "AI information",
      });

      expect(searchResult).toEqual([
        { name: "Test content", similarity: 0.8 },
        { name: "artificial intelligence", similarity: 0.7 },
      ]);
    });

    it("should handle the complete chat flow with tools", async () => {
      const { POST } = await import("@/app/(preview)/api/chat/route");

      // Mock stream text result
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      // Mock resource creation
      const mockResource = {
        id: "chat-resource-id",
        content: "User shared information",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      db.returning.mockResolvedValue([mockResource]);
      embedMany.mockResolvedValue({ embeddings: [[0.1, 0.2, 0.3]] });

      // Mock search results
      embed.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });
      db.limit.mockResolvedValue([
        { name: "Relevant information", similarity: 0.8 },
      ]);

      // Mock query understanding
      generateObject.mockResolvedValue({
        object: {
          questions: ["What is this about?", "How does it work?"],
        },
      });

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "I want to store this information: Machine learning is awesome",
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: "mocked-chat-model",
        messages: expect.any(Array),
        system: expect.stringContaining("You are a helpful assistant"),
        tools: expect.objectContaining({
          addResource: expect.any(Object),
          getInformation: expect.any(Object),
          understandQuery: expect.any(Object),
        }),
      });

      // Test that tools can be executed
      const tools = streamText.mock.calls[0][0].tools;

      // Test addResource tool
      const addResult = await tools.addResource.execute({
        content: "Machine learning is awesome",
      });
      expect(addResult).toBe("Resource successfully created and embedded.");

      // Test getInformation tool
      const infoResult = await tools.getInformation.execute({
        question: "What is machine learning?",
        similarQuestions: ["machine learning", "ML"],
      });
      expect(infoResult).toEqual([
        { name: "Relevant information", similarity: 0.8 },
      ]);

      // Test understandQuery tool
      const queryResult = await tools.understandQuery.execute({
        query: "Tell me about AI",
        toolsToCallInOrder: ["getInformation"],
      });
      expect(queryResult).toEqual(["What is this about?", "How does it work?"]);
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle database errors gracefully", async () => {
      const { createResource } = await import("@/lib/actions/resources");

      db.returning.mockRejectedValue(new Error("Database connection failed"));

      const result = await createResource({ content: "Test content" });

      expect(result).toBe("Database connection failed");
    });

    it("should handle AI API errors gracefully", async () => {
      const { generateEmbedding } = await import("@/lib/ai/embedding");

      embed.mockRejectedValue(new Error("AI API rate limit exceeded"));

      await expect(generateEmbedding("test")).rejects.toThrow(
        "AI API rate limit exceeded"
      );
    });

    it("should handle malformed chat requests", async () => {
      const { POST } = await import("@/app/(preview)/api/chat/route");

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: "invalid json",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await expect(POST(request)).rejects.toThrow();
    });
  });

  describe("Data Flow Integration", () => {
    it("should maintain data consistency across operations", async () => {
      const { createResource } = await import("@/lib/actions/resources");
      const { generateEmbeddings } = await import("@/lib/ai/embedding");

      const testContent = "Consistent data flow test";
      const mockResource = {
        id: "consistent-resource-id",
        content: testContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockEmbeddings = [
        { content: "Consistent data", embedding: [0.1, 0.2, 0.3] },
        { content: "flow test", embedding: [0.4, 0.5, 0.6] },
      ];

      db.returning.mockResolvedValue([mockResource]);
      embedMany.mockResolvedValue({
        embeddings: mockEmbeddings.map((e) => e.embedding),
      });

      const result = await createResource({ content: testContent });

      expect(result).toBe("Resource successfully created and embedded.");

      // Verify that the same content was used for both resource and embeddings
      expect(db.values).toHaveBeenCalledWith({ content: testContent });
      expect(embedMany).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        values: ["Consistent data", "flow test"],
      });
    });

    it("should handle large content processing", async () => {
      const { generateEmbeddings } = await import("@/lib/ai/embedding");

      const largeContent = "Sentence one. ".repeat(100) + "Final sentence.";
      const expectedChunks = largeContent
        .trim()
        .split(".")
        .filter((chunk) => chunk !== "");

      embedMany.mockResolvedValue({
        embeddings: expectedChunks.map(() => [0.1, 0.2, 0.3]),
      });

      const result = await generateEmbeddings(largeContent);

      expect(embedMany).toHaveBeenCalledWith({
        model: "mocked-embedding-model",
        values: expectedChunks,
      });

      expect(result).toHaveLength(expectedChunks.length);
      expect(result[0]).toEqual({
        content: expectedChunks[0],
        embedding: [0.1, 0.2, 0.3],
      });
    });
  });

  describe("Performance Integration", () => {
    it("should handle concurrent operations", async () => {
      const { createResource } = await import("@/lib/actions/resources");

      const mockResource = (id: string, content: string) => ({
        id,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      db.returning
        .mockResolvedValueOnce([mockResource("id1", "Content 1")])
        .mockResolvedValueOnce([mockResource("id2", "Content 2")])
        .mockResolvedValueOnce([mockResource("id3", "Content 3")]);

      embedMany.mockResolvedValue({
        embeddings: [[0.1, 0.2, 0.3]],
      });

      const promises = [
        createResource({ content: "Content 1" }),
        createResource({ content: "Content 2" }),
        createResource({ content: "Content 3" }),
      ];

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result).toBe("Resource successfully created and embedded.");
      });

      expect(db.insert).toHaveBeenCalledTimes(6); // 3 resources + 3 embeddings
    });

    it("should limit search results appropriately", async () => {
      const { findRelevantContent } = await import("@/lib/ai/embedding");

      embed.mockResolvedValue({ embedding: [0.1, 0.2, 0.3] });

      // Mock more than 4 results
      const mockResults = Array.from({ length: 10 }, (_, i) => ({
        name: `Result ${i + 1}`,
        similarity: 0.9 - i * 0.1,
      }));

      db.limit.mockResolvedValue(mockResults.slice(0, 4));

      const result = await findRelevantContent("test query");

      expect(db.limit).toHaveBeenCalledWith(4);
      expect(result).toHaveLength(4);
    });
  });
});
