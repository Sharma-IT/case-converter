import { CaseType, CaseConverter, CaseConverterMap } from './types';

/**
 * Convert string to sentence case (first letter capitalised, rest lowercase)
 */
export const toSentenceCase: CaseConverter = (input: string): string => {
  if (!input) return input;

  // Convert to lowercase first
  const lowerInput = input.toLowerCase();

  // Find the first alphabetic character
  let firstLetterIndex = -1;
  for (let i = 0; i < lowerInput.length; i++) {
    if (/[a-zA-Z]/.test(lowerInput[i])) {
      firstLetterIndex = i;
      break;
    }
  }

  if (firstLetterIndex === -1) return lowerInput; // No alphabetic characters

  return (
    lowerInput.slice(0, firstLetterIndex) +
    lowerInput[firstLetterIndex].toUpperCase() +
    lowerInput.slice(firstLetterIndex + 1)
  );
};

/**
 * Convert string to lowercase
 */
export const toLowerCase: CaseConverter = (input: string): string => {
  return input.toLowerCase();
};

/**
 * Convert string to uppercase
 */
export const toUpperCase: CaseConverter = (input: string): string => {
  return input.toUpperCase();
};

/**
 * Convert string to title case (first letter of each word capitalised)
 */
export const toTitleCase: CaseConverter = (input: string): string => {
  if (!input) return input;

  // First convert all to lowercase
  const lowerInput = input.toLowerCase();

  // Handle word boundaries and special characters
  return lowerInput
    // Capitalize first letter of each word (after word boundary)
    .replace(/\b\w/g, (char) => char.toUpperCase())
    // Capitalize letters after punctuation
    .replace(/[-_.]\w/g, (match) => {
      return match.charAt(0) + match.charAt(1).toUpperCase();
    });
};

/**
 * Toggle the case of each character
 */
export const toToggleCase: CaseConverter = (input: string): string => {
  return input
    .split('')
    .map((char) => {
      // Check if the character is a letter
      if (!/[a-zA-Z]/.test(char)) {
        return char;
      }

      // Toggle case
      if (char === char.toLowerCase()) {
        return char.toUpperCase();
      } else {
        return char.toLowerCase();
      }
    })
    .join('');
};

/**
 * Get all case converters mapped by their types
 */
export const getCaseConverters = (): CaseConverterMap => {
  return {
    [CaseType.SENTENCE]: toSentenceCase,
    [CaseType.LOWERCASE]: toLowerCase,
    [CaseType.UPPERCASE]: toUpperCase,
    [CaseType.TITLE]: toTitleCase,
    [CaseType.TOGGLE]: toToggleCase,
  };
};
