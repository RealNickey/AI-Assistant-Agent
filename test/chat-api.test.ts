import { POST } from "@/app/(preview)/api/chat/route";
import { NextRequest } from "next/server";

// Mock the AI SDK
jest.mock("ai", () => ({
  streamText: jest.fn(),
  tool: jest.fn((config) => config),
  generateObject: jest.fn(),
}));

// Mock the Google AI SDK
jest.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: jest.fn(() => ({
    "gemini-2.5-flash": "mocked-model",
  })),
}));

// Mock the actions
jest.mock("@/lib/actions/resources", () => ({
  createResource: jest.fn(),
}));

// Mock the embedding functions
jest.mock("@/lib/ai/embedding", () => ({
  findRelevantContent: jest.fn(),
}));

const { streamText, generateObject } = require("ai");
const { createResource } = require("@/lib/actions/resources");
const { findRelevantContent } = require("@/lib/ai/embedding");

describe("Chat API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST handler", () => {
    it("should handle chat request with tools", async () => {
      const mockMessages = [{ role: "user", content: "Hello, how are you?" }];

      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: "mocked-model",
        messages: mockMessages,
        system: expect.stringContaining("You are a helpful assistant"),
        tools: expect.objectContaining({
          addResource: expect.any(Object),
          getInformation: expect.any(Object),
          understandQuery: expect.any(Object),
        }),
      });

      expect(mockResult.toDataStreamResponse).toHaveBeenCalled();
    });

    it("should have correct system prompt", async () => {
      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain(
        "You are a helpful assistant acting as the users' second brain"
      );
      expect(systemPrompt).toContain("Use tools on every request");
      expect(systemPrompt).toContain(
        "Be sure to getInformation from your knowledge base"
      );
    });

    it("should handle malformed JSON", async () => {
      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: "invalid json",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await expect(POST(request)).rejects.toThrow();
    });

    it("should handle missing messages", async () => {
      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      await POST(request);

      expect(streamText).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: undefined,
        })
      );
    });
  });

  describe("addResource tool", () => {
    it("should be configured correctly", async () => {
      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      expect(tools.addResource).toBeDefined();
      expect(tools.addResource.description).toContain(
        "add a resource to your knowledge base"
      );
      expect(tools.addResource.parameters).toBeDefined();
    });

    it("should execute createResource when called", async () => {
      createResource.mockResolvedValue("Resource created successfully");

      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      const result = await tools.addResource.execute({
        content: "Test content",
      });

      expect(createResource).toHaveBeenCalledWith({ content: "Test content" });
      expect(result).toBe("Resource created successfully");
    });
  });

  describe("getInformation tool", () => {
    it("should be configured correctly", async () => {
      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      expect(tools.getInformation).toBeDefined();
      expect(tools.getInformation.description).toContain(
        "get information from your knowledge base"
      );
      expect(tools.getInformation.parameters).toBeDefined();
    });

    it("should execute findRelevantContent for each similar question", async () => {
      findRelevantContent
        .mockResolvedValueOnce([{ name: "Result 1", similarity: 0.8 }])
        .mockResolvedValueOnce([{ name: "Result 2", similarity: 0.7 }]);

      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      const result = await tools.getInformation.execute({
        question: "What is AI?",
        similarQuestions: ["artificial intelligence", "machine learning"],
      });

      expect(findRelevantContent).toHaveBeenCalledTimes(2);
      expect(findRelevantContent).toHaveBeenCalledWith(
        "artificial intelligence"
      );
      expect(findRelevantContent).toHaveBeenCalledWith("machine learning");
      expect(result).toEqual([
        { name: "Result 1", similarity: 0.8 },
        { name: "Result 2", similarity: 0.7 },
      ]);
    });

    it("should remove duplicates based on name", async () => {
      findRelevantContent
        .mockResolvedValueOnce([{ name: "Duplicate", similarity: 0.8 }])
        .mockResolvedValueOnce([{ name: "Duplicate", similarity: 0.7 }]);

      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      const result = await tools.getInformation.execute({
        question: "Test question",
        similarQuestions: ["question1", "question2"],
      });

      expect(result).toEqual([{ name: "Duplicate", similarity: 0.8 }]);
    });
  });

  describe("understandQuery tool", () => {
    it("should be configured correctly", async () => {
      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      expect(tools.understandQuery).toBeDefined();
      expect(tools.understandQuery.description).toContain(
        "understand the users query"
      );
      expect(tools.understandQuery.parameters).toBeDefined();
    });

    it("should execute generateObject to understand query", async () => {
      const mockQuestions = {
        object: {
          questions: ["What is AI?", "How does AI work?", "AI applications"],
        },
      };

      generateObject.mockResolvedValue(mockQuestions);

      const mockMessages = [{ role: "user", content: "Test" }];
      const mockResult = {
        toDataStreamResponse: jest.fn().mockReturnValue(new Response("stream")),
      };

      streamText.mockReturnValue(mockResult);

      const request = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: mockMessages }),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      const result = await tools.understandQuery.execute({
        query: "Tell me about AI",
        toolsToCallInOrder: ["getInformation"],
      });

      expect(generateObject).toHaveBeenCalledWith({
        model: "mocked-model",
        system: expect.stringContaining(
          "You are a query understanding assistant"
        ),
        schema: expect.any(Object),
        prompt: expect.stringContaining("Tell me about AI"),
      });

      expect(result).toEqual([
        "What is AI?",
        "How does AI work?",
        "AI applications",
      ]);
    });
  });
});
