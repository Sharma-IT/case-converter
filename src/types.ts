/**
 * Supported case conversion types
 */
export enum CaseType {
  SENTENCE = 'sentence',
  LOWERCASE = 'lowercase',
  UPPERCASE = 'uppercase',
  TITLE = 'title',
  TOGGLE = 'toggle',
}

/**
 * Case conversion function signature
 */
export type CaseConverter = (input: string) => string;

/**
 * Map of case types to their conversion functions
 */
export type CaseConverterMap = {
  [key in CaseType]: CaseConverter;
};

/**
 * CLI input options
 */
export interface CliOptions {
  input?: string;
  help?: boolean;
  version?: boolean;
}

/**
 * Case conversion result
 */
export interface ConversionResult {
  type: CaseType;
  label: string;
  result: string;
}

/**
 * CLI output format
 */
export interface CliOutput {
  input: string;
  conversions: ConversionResult[];
}

/**
 * Error types for the CLI
 */
export enum ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  NO_INPUT = 'NO_INPUT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom error class for CLI errors
 */
export class CliError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public exitCode: number = 1
  ) {
    super(message);
    this.name = 'CliError';
  }
}
