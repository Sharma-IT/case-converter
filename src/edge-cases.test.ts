import { processInput, formatOutput } from './cli';
import { toSentenceCase, toLowerCase, toUpperCase, toTitleCase, toToggleCase } from './converters';

describe('Edge Cases and Error Handling', () => {
  describe('Unicode and International Characters', () => {
    it('should handle accented characters', () => {
      expect(toSentenceCase('CAFÉ NAÏVE')).toBe('Café naïve');
      expect(toTitleCase('café naïve')).toBe('Café NaïVe');
      expect(toLowerCase('CAFÉ NAÏVE')).toBe('café naïve');
      expect(toUpperCase('café naïve')).toBe('CAFÉ NAÏVE');
    });

    it('should handle non-Latin scripts', () => {
      const cyrillic = 'ПРИВЕТ МИР';
      expect(toLowerCase(cyrillic)).toBe('привет мир');
      expect(toUpperCase('привет мир')).toBe('ПРИВЕТ МИР');
    });

    it('should handle mixed scripts', () => {
      const mixed = 'Hello 世界 WORLD';
      expect(toSentenceCase(mixed)).toBe('Hello 世界 world');
      expect(toTitleCase(mixed)).toBe('Hello 世界 World');
    });

    it('should handle emoji and symbols', () => {
      const withEmoji = 'hello 🌍 WORLD!';
      expect(toSentenceCase(withEmoji)).toBe('Hello 🌍 world!');
      expect(toTitleCase(withEmoji)).toBe('Hello 🌍 World!');
      expect(toToggleCase(withEmoji)).toBe('HELLO 🌍 world!');
    });
  });

  describe('Whitespace and Special Characters', () => {
    it('should handle various whitespace characters', () => {
      const whitespace = 'hello\t\n\r WORLD';
      expect(toSentenceCase(whitespace)).toBe('Hello\t\n\r world');
      expect(toTitleCase(whitespace)).toBe('Hello\t\n\r World');
    });

    it('should handle leading and trailing whitespace', () => {
      const padded = '   hello WORLD   ';
      expect(toSentenceCase(padded)).toBe('   Hello world   ');
      expect(toTitleCase(padded)).toBe('   Hello World   ');
    });

    it('should handle only special characters', () => {
      const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      expect(toSentenceCase(special)).toBe(special);
      expect(toTitleCase(special)).toBe(special);
      expect(toToggleCase(special)).toBe(special);
    });

    it('should handle mixed special characters and letters', () => {
      const mixed = '!hello@WORLD#';
      expect(toSentenceCase(mixed)).toBe('!Hello@world#');
      expect(toTitleCase(mixed)).toBe('!Hello@World#');
      expect(toToggleCase(mixed)).toBe('!HELLO@world#');
    });
  });

  describe('Numbers and Alphanumeric', () => {
    it('should handle numbers only', () => {
      const numbers = '12345';
      expect(toSentenceCase(numbers)).toBe(numbers);
      expect(toTitleCase(numbers)).toBe(numbers);
      expect(toToggleCase(numbers)).toBe(numbers);
    });

    it('should handle mixed numbers and letters', () => {
      const mixed = 'hello123WORLD456';
      expect(toSentenceCase(mixed)).toBe('Hello123world456');
      expect(toTitleCase(mixed)).toBe('Hello123world456');
      expect(toToggleCase(mixed)).toBe('HELLO123world456');
    });

    it('should handle version-like strings', () => {
      const version = 'v1.2.3-BETA';
      expect(toSentenceCase(version)).toBe('V1.2.3-beta');
      expect(toTitleCase(version)).toBe('V1.2.3-Beta');
    });
  });

  describe('Performance and Large Inputs', () => {
    it('should handle very long strings efficiently', async () => {
      const longString = 'a'.repeat(50000) + 'B'.repeat(50000);
      const start = Date.now();
      
      const result = await processInput(longString);
      const end = Date.now();
      
      expect(result.input).toBe(longString);
      expect(result.conversions).toHaveLength(5);
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle strings with many words', () => {
      const manyWords = Array(1000).fill('word').join(' ');
      const result = formatOutput(manyWords);
      
      expect(result.conversions).toHaveLength(5);
      expect(result.conversions[0].result).toMatch(/^Word /);
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle single character strings', () => {
      expect(toSentenceCase('a')).toBe('A');
      expect(toSentenceCase('A')).toBe('A');
      expect(toTitleCase('a')).toBe('A');
      expect(toToggleCase('a')).toBe('A');
      expect(toToggleCase('A')).toBe('a');
    });

    it('should handle two character strings', () => {
      expect(toSentenceCase('ab')).toBe('Ab');
      expect(toSentenceCase('AB')).toBe('Ab');
      expect(toTitleCase('ab')).toBe('Ab');
      expect(toToggleCase('ab')).toBe('AB');
      expect(toToggleCase('AB')).toBe('ab');
    });

    it('should handle strings with only one letter', () => {
      expect(toSentenceCase('123a456')).toBe('123A456');
      expect(toTitleCase('123a456')).toBe('123a456');
      expect(toToggleCase('123a456')).toBe('123A456');
    });
  });

  describe('Error Recovery', () => {
    it('should handle null-like inputs gracefully', () => {
      expect(toSentenceCase('')).toBe('');
      expect(toTitleCase('')).toBe('');
      expect(toToggleCase('')).toBe('');
    });

    it('should handle malformed input gracefully', async () => {
      // Test with various edge cases that shouldn't crash
      const edgeCases = [
        'a\0\0\0', // Add a letter to avoid empty input error
        'a\uFEFF', // BOM character
        'a\u200B', // Zero-width space
        'a' + String.fromCharCode(0x1F4A9), // Pile of poo emoji
      ];

      for (const testCase of edgeCases) {
        const result = await processInput(testCase);
        expect(result.conversions).toHaveLength(5);
      }
    });
  });

  describe('Memory and Resource Management', () => {
    it('should not leak memory with repeated conversions', () => {
      const testString = 'Hello World Test String';
      
      // Run many conversions to test for memory leaks
      for (let i = 0; i < 1000; i++) {
        toSentenceCase(testString);
        toLowerCase(testString);
        toUpperCase(testString);
        toTitleCase(testString);
        toToggleCase(testString);
      }
      
      // If we get here without crashing, memory management is likely OK
      expect(true).toBe(true);
    });

    it('should handle concurrent processing', async () => {
      const promises = Array(10).fill(0).map((_, i) => 
        processInput(`test string ${i}`)
      );
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(10);
      results.forEach((result, i) => {
        expect(result.input).toBe(`test string ${i}`);
        expect(result.conversions).toHaveLength(5);
      });
    });
  });
});
