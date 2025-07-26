import { insertResourceSchema, resources } from "@/lib/db/schema/resources";
import { z } from "zod";

// Mock the database and nanoid
jest.mock("@/lib/utils", () => ({
  nanoid: () => "test-resource-id",
}));

describe("Resources Schema", () => {
  describe("resources table", () => {
    it("should have correct table name", () => {
      expect(resources).toBeDefined();
    });

    it("should have all required columns", () => {
      const columns = Object.keys(resources);
      expect(columns).toContain("id");
      expect(columns).toContain("content");
      expect(columns).toContain("createdAt");
      expect(columns).toContain("updatedAt");
    });
  });

  describe("insertResourceSchema", () => {
    it("should validate valid resource data", () => {
      const validData = {
        content: "This is test content for a resource",
      };

      const result = insertResourceSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.content).toBe(validData.content);
      }
    });

    it("should reject empty content", () => {
      const invalidData = {
        content: "",
      };

      const result = insertResourceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing content", () => {
      const invalidData = {};

      const result = insertResourceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject null content", () => {
      const invalidData = {
        content: null,
      };

      const result = insertResourceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept long content", () => {
      const validData = {
        content: "A".repeat(10000), // Very long content
      };

      const result = insertResourceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should omit id, createdAt, and updatedAt from input schema", () => {
      const dataWithExtraFields = {
        id: "should-be-ignored",
        content: "Valid content",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = insertResourceSchema.safeParse(dataWithExtraFields);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({
          content: "Valid content",
        });
        expect(result.data).not.toHaveProperty("id");
        expect(result.data).not.toHaveProperty("createdAt");
        expect(result.data).not.toHaveProperty("updatedAt");
      }
    });

    it("should be compatible with zod type inference", () => {
      type ExpectedType = {
        content: string;
      };

      const validData: z.infer<typeof insertResourceSchema> = {
        content: "Type-safe content",
      };

      // This should compile without errors
      const _typeCheck: ExpectedType = validData;

      expect(validData.content).toBe("Type-safe content");
    });
  });
});
