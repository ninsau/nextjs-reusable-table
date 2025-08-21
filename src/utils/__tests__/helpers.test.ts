import { formatDate, isDateString, trimText } from "../helpers";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("formats date without time", () => {
      const date = new Date("2024-03-15T14:30:00Z");
      const result = formatDate(date);

      expect(result).toBe("Mar 15, 2024");
    });

    it("formats date with time when includeTime is true", () => {
      const date = new Date("2024-03-15T14:30:00Z");
      const result = formatDate(date, true);

      expect(result).toMatch(/Mar 15, 2024.*14:30|2:30/); // Handles timezone differences
    });

    it("handles different date formats", () => {
      const dates = [
        new Date("2024-01-01T00:00:00Z"),
        new Date("2024-12-31T23:59:59Z"),
        new Date("2024-06-15T12:00:00Z"),
      ];

      dates.forEach((date) => {
        const result = formatDate(date);
        expect(result).toMatch(/\w{3} \d{1,2}, \d{4}/);
      });
    });

    it("formats time in 24-hour format when includeTime is true", () => {
      const date = new Date("2024-03-15T09:05:00Z");
      const result = formatDate(date, true);

      expect(result).toMatch(/09:05|9:05/);
    });

    it("handles edge case dates", () => {
      const edgeCases = [
        new Date("2000-01-01T00:00:00Z"), // Y2K
        new Date("2024-02-29T12:00:00Z"), // Leap year
        new Date("1970-01-01T00:00:00Z"), // Unix epoch
      ];

      edgeCases.forEach((date) => {
        expect(() => formatDate(date)).not.toThrow();
        expect(() => formatDate(date, true)).not.toThrow();
      });
    });
  });

  describe("isDateString", () => {
    it("returns true for valid ISO date strings", () => {
      const validDates = [
        "2024-03-15T14:30:00Z",
        "2024-03-15T14:30:00.000Z",
        "2024-03-15",
        "2024-03-15T14:30:00+05:00",
        "2024-12-31T23:59:59.999Z",
      ];

      validDates.forEach((dateString) => {
        expect(isDateString(dateString)).toBe(true);
      });
    });

    it("returns true for valid date formats", () => {
      const validDates = [
        "March 15, 2024",
        "3/15/2024",
        "15 Mar 2024",
        "2024/03/15",
      ];

      validDates.forEach((dateString) => {
        expect(isDateString(dateString)).toBe(true);
      });
    });

    it("returns false for invalid date strings", () => {
      const invalidDates = [
        "not a date",
        "2024-13-45", // Invalid month and day
        "2024-02-30", // Invalid date for February
        "abc123",
        "",
        "2024", // Too short
        "hello world",
        "123456789", // Numbers but not a date
      ];

      invalidDates.forEach((dateString) => {
        expect(isDateString(dateString)).toBe(false);
      });
    });

    it("returns false for strings shorter than 10 characters", () => {
      const shortStrings = [
        "2024-03-1", // 9 characters
        "test",
        "abc",
        "12345678", // 8 characters
        "",
      ];

      shortStrings.forEach((str) => {
        expect(isDateString(str)).toBe(false);
      });
    });

    it("returns false for null, undefined, and non-strings", () => {
      const invalidInputs = [
        null,
        undefined,
        123,
        {},
        [],
        true,
        false,
      ] as any[];

      invalidInputs.forEach((input) => {
        expect(isDateString(input)).toBe(false);
      });
    });

    it("handles edge cases correctly", () => {
      expect(isDateString("2024-02-29T12:00:00Z")).toBe(true); // Leap year
      expect(isDateString("2023-02-29T12:00:00Z")).toBe(false); // Not leap year
      expect(isDateString("2024-00-01T12:00:00Z")).toBe(false); // Invalid month
      expect(isDateString("2024-12-32T12:00:00Z")).toBe(false); // Invalid day
    });
  });

  describe("trimText", () => {
    it("trims text longer than maxLength", () => {
      const text = "This is a very long text that should be trimmed";
      const result = trimText(text, 20);

      expect(result).toBe("This is a very long ...");
      expect(result.length).toBe(23); // 20 + "..."
    });

    it("returns original text when shorter than maxLength", () => {
      const text = "Short text";
      const result = trimText(text, 20);

      expect(result).toBe("Short text");
    });

    it("returns original text when exactly maxLength", () => {
      const text = "Exact length text ok";
      const result = trimText(text, 20);

      expect(result).toBe("Exact length text ok");
    });

    it("handles empty strings", () => {
      expect(trimText("", 10)).toBe("");
    });

    it("handles zero maxLength", () => {
      const result = trimText("Some text", 0);
      expect(result).toBe("...");
    });

    it("handles negative maxLength", () => {
      const result = trimText("Some text", -5);
      expect(result).toBe("...");
    });

    it("handles very short maxLength", () => {
      const result = trimText("Hello World", 3);
      expect(result).toBe("Hel...");
    });

    it("handles single character maxLength", () => {
      const result = trimText("Hello", 1);
      expect(result).toBe("H...");
    });

    it("preserves spaces and special characters", () => {
      const text = "Text with  spaces and special chars!@#";
      const result = trimText(text, 15);

      expect(result).toBe("Text with  spac...");
    });

    it("handles unicode characters correctly", () => {
      const text = "こんにちは世界！This is unicode text";
      const result = trimText(text, 10);

      expect(result).toBe("こんにちは世界！This...");
      expect(result.length).toBe(13); // 10 + "..."
    });

    it("handles numbers and mixed content", () => {
      const mixedText = "User123@email.com - Account #456789";
      const result = trimText(mixedText, 15);

      expect(result).toBe("User123@email.c...");
    });

    describe("Edge cases", () => {
      it("handles very large maxLength", () => {
        const text = "Short";
        const result = trimText(text, 1000);

        expect(result).toBe("Short");
      });

      it("handles text with only whitespace", () => {
        const result = trimText("     ", 3);
        expect(result).toBe("   ...");
      });

      it("handles text with newlines", () => {
        const text = "Line 1\nLine 2\nLine 3";
        const result = trimText(text, 10);

        expect(result).toBe("Line 1\nLin...");
      });
    });
  });

  describe("Integration tests", () => {
    it("works correctly when chaining helper functions", () => {
      const dateString = "2024-03-15T14:30:00Z";

      if (isDateString(dateString)) {
        const formatted = formatDate(new Date(dateString), true);
        const trimmed = trimText(formatted, 12);

        expect(trimmed).toMatch(/Mar 15, 2024.../);
      }
    });

    it("handles invalid dates in chain gracefully", () => {
      const invalidDate = "not a date";

      expect(isDateString(invalidDate)).toBe(false);

      // If someone still tries to format it
      const result = formatDate(new Date(invalidDate));
      expect(result).toBe("Invalid Date");
    });

    it("preserves data through trim operations", () => {
      const longText =
        "This is important data that should be preserved as much as possible";
      const trimmed = trimText(longText, 30);

      expect(trimmed).toContain("This is important data that sh");
      expect(trimmed.endsWith("...")).toBe(true);
    });
  });
});
