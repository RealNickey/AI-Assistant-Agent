import { env } from "@/lib/env.mjs";

// Mock environment variables for testing
const originalEnv = process.env;

describe("Environment Configuration", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("server environment variables", () => {
    it("should validate NODE_ENV correctly", () => {
      // In test environment, NODE_ENV should be available
      expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    });

    it("should require POSTGRES_URL", () => {
      // This test assumes POSTGRES_URL is set in test environment
      expect(typeof env.POSTGRES_URL).toBe("string");
      expect(env.POSTGRES_URL.length).toBeGreaterThan(0);
    });

    it("should handle optional CLERK_SECRET_KEY", () => {
      // CLERK_SECRET_KEY is optional, so it can be undefined
      if (env.CLERK_SECRET_KEY !== undefined) {
        expect(typeof env.CLERK_SECRET_KEY).toBe("string");
        expect(env.CLERK_SECRET_KEY.length).toBeGreaterThan(0);
      }
    });

    it("should handle optional GOOGLE_GENERATIVE_AI_API_KEY", () => {
      // GOOGLE_GENERATIVE_AI_API_KEY is optional, so it can be undefined
      if (env.GOOGLE_GENERATIVE_AI_API_KEY !== undefined) {
        expect(typeof env.GOOGLE_GENERATIVE_AI_API_KEY).toBe("string");
        expect(env.GOOGLE_GENERATIVE_AI_API_KEY.length).toBeGreaterThan(0);
      }
    });
  });

  describe("client environment variables", () => {
    it("should handle optional NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", () => {
      // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is optional
      const clerkPublicKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      if (clerkPublicKey !== undefined) {
        expect(typeof clerkPublicKey).toBe("string");
        expect(clerkPublicKey.length).toBeGreaterThan(0);
      }
    });
  });

  describe("environment validation", () => {
    it("should export env object", () => {
      expect(env).toBeDefined();
      expect(typeof env).toBe("object");
    });

    it("should have all required server variables", () => {
      expect(env).toHaveProperty("NODE_ENV");
      expect(env).toHaveProperty("POSTGRES_URL");
    });

    it("should validate NODE_ENV enum values", () => {
      expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    });

    it("should ensure POSTGRES_URL is not empty", () => {
      expect(env.POSTGRES_URL).toBeTruthy();
      expect(env.POSTGRES_URL.length).toBeGreaterThan(0);
    });
  });

  describe("runtime environment mapping", () => {
    it("should map server variables correctly", () => {
      // These should match the runtimeEnv mapping
      expect(env.POSTGRES_URL).toBe(process.env.POSTGRES_URL);
      
      if (process.env.CLERK_SECRET_KEY) {
        expect(env.CLERK_SECRET_KEY).toBe(process.env.CLERK_SECRET_KEY);
      }
      
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        expect(env.GOOGLE_GENERATIVE_AI_API_KEY).toBe(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
      }
    });

    it("should map client variables correctly", () => {
      if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        expect(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).toBe(
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        );
      }
    });
  });

  describe("type safety", () => {
    it("should provide TypeScript type safety", () => {
      // These should not throw TypeScript errors
      const nodeEnv: string = env.NODE_ENV;
      const postgresUrl: string = env.POSTGRES_URL;
      
      expect(typeof nodeEnv).toBe("string");
      expect(typeof postgresUrl).toBe("string");
    });

    it("should handle optional properties correctly", () => {
      // These properties are optional and might be undefined
      const clerkSecret = env.CLERK_SECRET_KEY;
      const googleKey = env.GOOGLE_GENERATIVE_AI_API_KEY;
      const clerkPublic = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      
      if (clerkSecret !== undefined) {
        expect(typeof clerkSecret).toBe("string");
      }
      
      if (googleKey !== undefined) {
        expect(typeof googleKey).toBe("string");
      }
      
      if (clerkPublic !== undefined) {
        expect(typeof clerkPublic).toBe("string");
      }
    });
  });

  describe("development environment", () => {
    it("should work in development mode", () => {
      // Test that the environment configuration supports development
      expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    });
  });

  describe("production environment", () => {
    it("should support production mode configuration", () => {
      // Test that the environment schema supports production
      expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    });
  });
});
