import { cn, nanoid } from "@/lib/utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("should merge classes correctly", () => {
      const result = cn("px-2 py-1", "text-red-500");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
      expect(result).toContain("text-red-500");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should handle false conditions", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class");
    });

    it("should merge conflicting tailwind classes", () => {
      const result = cn("px-2", "px-4");
      expect(result).toBe("px-4");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["px-2", "py-1"], "text-red-500");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
      expect(result).toContain("text-red-500");
    });
  });

  describe("nanoid function", () => {
    it("should generate a string", () => {
      const id = nanoid();
      expect(typeof id).toBe("string");
    });

    it("should generate consistent id in test environment", () => {
      const id1 = nanoid();
      const id2 = nanoid();
      // In test environment, both should return mocked value
      expect(id1).toBe("test-id-123");
      expect(id2).toBe("test-id-123");
    });

    it("should not be empty", () => {
      const id = nanoid();
      expect(id.length).toBeGreaterThan(0);
    });
  });
});
