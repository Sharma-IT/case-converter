import { parseArgs, formatOutput, processInput } from './cli';
import { CaseType, CliError, ErrorType } from './types';

// Mock process.stdin for testing
const mockStdin = {
  setEncoding: jest.fn(),
  on: jest.fn(),
  resume: jest.fn(),
};

// Mock process for testing
const mockProcess = {
  stdin: mockStdin,
  argv: ['node', 'cli.js'],
  exit: jest.fn(),
};

describe('CLI Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseArgs', () => {
    it('should parse command line arguments correctly', () => {
      const args = ['node', 'cli.js', 'hello world'];
      const result = parseArgs(args);
      
      expect(result.input).toBe('hello world');
      expect(result.help).toBe(false);
      expect(result.version).toBe(false);
    });

    it('should handle help flag', () => {
      const args1 = ['node', 'cli.js', '--help'];
      const args2 = ['node', 'cli.js', '-h'];
      
      expect(parseArgs(args1).help).toBe(true);
      expect(parseArgs(args2).help).toBe(true);
    });

    it('should handle version flag', () => {
      const args1 = ['node', 'cli.js', '--version'];
      const args2 = ['node', 'cli.js', '-v'];
      
      expect(parseArgs(args1).version).toBe(true);
      expect(parseArgs(args2).version).toBe(true);
    });

    it('should handle multiple arguments as single input', () => {
      const args = ['node', 'cli.js', 'hello', 'world', 'test'];
      const result = parseArgs(args);
      
      expect(result.input).toBe('hello world test');
    });

    it('should handle empty arguments', () => {
      const args = ['node', 'cli.js'];
      const result = parseArgs(args);
      
      expect(result.input).toBeUndefined();
      expect(result.help).toBe(false);
      expect(result.version).toBe(false);
    });

    it('should prioritise flags over input', () => {
      const args = ['node', 'cli.js', 'hello', '--help'];
      const result = parseArgs(args);
      
      expect(result.help).toBe(true);
      expect(result.input).toBeUndefined();
    });
  });

  describe('formatOutput', () => {
    it('should format output correctly', () => {
      const input = 'hello WORLD';
      const output = formatOutput(input);
      
      expect(output.input).toBe(input);
      expect(output.conversions).toHaveLength(5);
      
      const conversionTypes = output.conversions.map(c => c.type);
      expect(conversionTypes).toContain(CaseType.SENTENCE);
      expect(conversionTypes).toContain(CaseType.LOWERCASE);
      expect(conversionTypes).toContain(CaseType.UPPERCASE);
      expect(conversionTypes).toContain(CaseType.TITLE);
      expect(conversionTypes).toContain(CaseType.TOGGLE);
    });

    it('should have correct labels', () => {
      const output = formatOutput('test');
      const labels = output.conversions.map(c => c.label);
      
      expect(labels).toContain('Sentence case');
      expect(labels).toContain('lowercase');
      expect(labels).toContain('UPPERCASE');
      expect(labels).toContain('Title Case');
      expect(labels).toContain('tOGGLE cASE');
    });

    it('should produce correct conversions', () => {
      const output = formatOutput('hello WORLD');
      
      const sentenceCase = output.conversions.find(c => c.type === CaseType.SENTENCE);
      const lowerCase = output.conversions.find(c => c.type === CaseType.LOWERCASE);
      const upperCase = output.conversions.find(c => c.type === CaseType.UPPERCASE);
      const titleCase = output.conversions.find(c => c.type === CaseType.TITLE);
      const toggleCase = output.conversions.find(c => c.type === CaseType.TOGGLE);
      
      expect(sentenceCase?.result).toBe('Hello world');
      expect(lowerCase?.result).toBe('hello world');
      expect(upperCase?.result).toBe('HELLO WORLD');
      expect(titleCase?.result).toBe('Hello World');
      expect(toggleCase?.result).toBe('HELLO world');
    });

    it('should handle empty strings', () => {
      const output = formatOutput('');
      
      expect(output.input).toBe('');
      expect(output.conversions).toHaveLength(5);
      output.conversions.forEach(conversion => {
        expect(conversion.result).toBe('');
      });
    });
  });

  describe('processInput', () => {
    it('should process direct input', async () => {
      const result = await processInput('hello WORLD');
      
      expect(result.input).toBe('hello WORLD');
      expect(result.conversions).toHaveLength(5);
    });

    it('should throw error for empty input', async () => {
      await expect(processInput('')).rejects.toThrow(CliError);
      await expect(processInput('')).rejects.toThrow('No input provided');
    });

    it('should throw error for whitespace-only input', async () => {
      await expect(processInput('   ')).rejects.toThrow(CliError);
      await expect(processInput('\t\n')).rejects.toThrow(CliError);
    });

    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(10000);
      const result = await processInput(longString);
      
      expect(result.input).toBe(longString);
      expect(result.conversions).toHaveLength(5);
    });

    it('should handle strings with special characters', async () => {
      const specialString = 'hello@#$%^&*()world123';
      const result = await processInput(specialString);
      
      expect(result.input).toBe(specialString);
      expect(result.conversions).toHaveLength(5);
    });
  });

  describe('Error Handling', () => {
    it('should create CliError with correct properties', () => {
      const error = new CliError(ErrorType.NO_INPUT, 'Test error', 2);
      
      expect(error.type).toBe(ErrorType.NO_INPUT);
      expect(error.message).toBe('Test error');
      expect(error.exitCode).toBe(2);
      expect(error.name).toBe('CliError');
    });

    it('should have default exit code of 1', () => {
      const error = new CliError(ErrorType.INVALID_INPUT, 'Test error');
      
      expect(error.exitCode).toBe(1);
    });
  });
});
