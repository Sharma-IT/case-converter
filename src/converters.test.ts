import { CaseType } from './types';
import { 
  toSentenceCase, 
  toLowerCase, 
  toUpperCase, 
  toTitleCase, 
  toToggleCase,
  getCaseConverters 
} from './converters';

describe('Case Conversion Functions', () => {
  describe('toSentenceCase', () => {
    it('should convert to sentence case', () => {
      expect(toSentenceCase('hello WORLD')).toBe('Hello world');
      expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
      expect(toSentenceCase('hello world')).toBe('Hello world');
      expect(toSentenceCase('hELLO wORLD')).toBe('Hello world');
    });

    it('should handle empty strings', () => {
      expect(toSentenceCase('')).toBe('');
    });

    it('should handle single characters', () => {
      expect(toSentenceCase('a')).toBe('A');
      expect(toSentenceCase('A')).toBe('A');
    });

    it('should handle strings with numbers and special characters', () => {
      expect(toSentenceCase('hello123 WORLD!')).toBe('Hello123 world!');
      expect(toSentenceCase('123abc')).toBe('123Abc');
      expect(toSentenceCase('!@#$%')).toBe('!@#$%');
    });

    it('should handle whitespace', () => {
      expect(toSentenceCase('  hello WORLD  ')).toBe('  Hello world  ');
      expect(toSentenceCase('\thello\nWORLD\r')).toBe('\tHello\nworld\r');
    });
  });

  describe('toLowerCase', () => {
    it('should convert to lowercase', () => {
      expect(toLowerCase('HELLO WORLD')).toBe('hello world');
      expect(toLowerCase('Hello World')).toBe('hello world');
      expect(toLowerCase('hELLO wORLD')).toBe('hello world');
    });

    it('should handle empty strings', () => {
      expect(toLowerCase('')).toBe('');
    });

    it('should handle strings with numbers and special characters', () => {
      expect(toLowerCase('HELLO123 WORLD!')).toBe('hello123 world!');
      expect(toLowerCase('123ABC')).toBe('123abc');
    });
  });

  describe('toUpperCase', () => {
    it('should convert to uppercase', () => {
      expect(toUpperCase('hello world')).toBe('HELLO WORLD');
      expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
      expect(toUpperCase('hELLO wORLD')).toBe('HELLO WORLD');
    });

    it('should handle empty strings', () => {
      expect(toUpperCase('')).toBe('');
    });

    it('should handle strings with numbers and special characters', () => {
      expect(toUpperCase('hello123 world!')).toBe('HELLO123 WORLD!');
      expect(toUpperCase('123abc')).toBe('123ABC');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('hELLO wORLD')).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('should handle single words', () => {
      expect(toTitleCase('hello')).toBe('Hello');
      expect(toTitleCase('HELLO')).toBe('Hello');
    });

    it('should handle multiple spaces', () => {
      expect(toTitleCase('hello  world')).toBe('Hello  World');
      expect(toTitleCase('hello   world   test')).toBe('Hello   World   Test');
    });

    it('should handle strings with numbers and special characters', () => {
      expect(toTitleCase('hello123 world!')).toBe('Hello123 World!');
      expect(toTitleCase('123abc def')).toBe('123abc Def');
    });

    it('should handle punctuation correctly', () => {
      expect(toTitleCase('hello-world')).toBe('Hello-World');
      expect(toTitleCase('hello_world')).toBe('Hello_World');
      expect(toTitleCase('hello.world')).toBe('Hello.World');
    });
  });

  describe('toToggleCase', () => {
    it('should toggle case of each character', () => {
      expect(toToggleCase('Hello World')).toBe('hELLO wORLD');
      expect(toToggleCase('HELLO WORLD')).toBe('hello world');
      expect(toToggleCase('hello world')).toBe('HELLO WORLD');
    });

    it('should handle empty strings', () => {
      expect(toToggleCase('')).toBe('');
    });

    it('should handle mixed case', () => {
      expect(toToggleCase('hELLO wORLD')).toBe('Hello World');
      expect(toToggleCase('HeLLo WoRLd')).toBe('hEllO wOrlD');
    });

    it('should handle strings with numbers and special characters', () => {
      expect(toToggleCase('Hello123 World!')).toBe('hELLO123 wORLD!');
      expect(toToggleCase('123ABC def')).toBe('123abc DEF');
      expect(toToggleCase('!@#$%')).toBe('!@#$%');
    });
  });

  describe('getCaseConverters', () => {
    it('should return all case converters', () => {
      const converters = getCaseConverters();
      
      expect(converters).toHaveProperty(CaseType.SENTENCE);
      expect(converters).toHaveProperty(CaseType.LOWERCASE);
      expect(converters).toHaveProperty(CaseType.UPPERCASE);
      expect(converters).toHaveProperty(CaseType.TITLE);
      expect(converters).toHaveProperty(CaseType.TOGGLE);
      
      expect(typeof converters[CaseType.SENTENCE]).toBe('function');
      expect(typeof converters[CaseType.LOWERCASE]).toBe('function');
      expect(typeof converters[CaseType.UPPERCASE]).toBe('function');
      expect(typeof converters[CaseType.TITLE]).toBe('function');
      expect(typeof converters[CaseType.TOGGLE]).toBe('function');
    });

    it('should have working converter functions', () => {
      const converters = getCaseConverters();
      const testInput = 'hello WORLD';
      
      expect(converters[CaseType.SENTENCE](testInput)).toBe('Hello world');
      expect(converters[CaseType.LOWERCASE](testInput)).toBe('hello world');
      expect(converters[CaseType.UPPERCASE](testInput)).toBe('HELLO WORLD');
      expect(converters[CaseType.TITLE](testInput)).toBe('Hello World');
      expect(converters[CaseType.TOGGLE](testInput)).toBe('HELLO world');
    });
  });
});
