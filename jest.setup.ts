import "@testing-library/jest-dom";

// Mock environment variables
process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-api-key";
process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";

// Mock drizzle-zod to avoid table schema issues
jest.mock("drizzle-zod", () => ({
  createSelectSchema: (table: any) => {
    const { z } = require("zod");
    return z.object({
      content: z.string().min(1),
    });
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Polyfill Request and Response for Node.js environment
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(public url: string, public options: any = {}) {}
    async json() {
      return JSON.parse(this.options.body || "{}");
    }
  } as any;
}

if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(public body: any, public options: any = {}) {}
  } as any;
}

// Global test utilities
declare global {
  var mockConsoleError: () => () => void;
}

globalThis.mockConsoleError = () => {
  const originalError = console.error;
  console.error = jest.fn();
  return () => {
    console.error = originalError;
  };
};
