import { CaseType, CliOptions, CliOutput, ConversionResult, CliError, ErrorType } from './types';
import { getCaseConverters } from './converters';

/**
 * Parse command line arguments
 */
export const parseArgs = (args: string[]): CliOptions => {
  const options: CliOptions = {
    help: false,
    version: false,
  };

  // Skip 'node' and script name
  const userArgs = args.slice(2);

  // Check for flags first
  for (const arg of userArgs) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options; // Return early for help
    }
    if (arg === '--version' || arg === '-v') {
      options.version = true;
      return options; // Return early for version
    }
  }

  // If no flags, treat all arguments as input
  if (userArgs.length > 0) {
    options.input = userArgs.join(' ');
  }

  return options;
};

/**
 * Format the output with all case conversions
 */
export const formatOutput = (input: string): CliOutput => {
  const converters = getCaseConverters();
  const conversions: ConversionResult[] = [];

  // Define labels for each case type
  const labels = {
    [CaseType.SENTENCE]: 'Sentence case',
    [CaseType.LOWERCASE]: 'lowercase',
    [CaseType.UPPERCASE]: 'UPPERCASE',
    [CaseType.TITLE]: 'Title Case',
    [CaseType.TOGGLE]: 'tOGGLE cASE',
  };

  // Generate all conversions
  for (const [type, converter] of Object.entries(converters)) {
    const caseType = type as CaseType;
    conversions.push({
      type: caseType,
      label: labels[caseType],
      result: converter(input),
    });
  }

  return {
    input,
    conversions,
  };
};

/**
 * Process input and return formatted output
 */
export const processInput = async (input: string): Promise<CliOutput> => {
  // Validate input
  if (!input || input.trim().length === 0) {
    throw new CliError(ErrorType.NO_INPUT, 'No input provided. Please provide text to convert.');
  }

  // Check for extremely long inputs (performance consideration)
  if (input.length > 100000) {
    console.warn('Warning: Processing very long input may take some time...');
  }

  try {
    return formatOutput(input);
  } catch (error) {
    throw new CliError(
      ErrorType.UNKNOWN_ERROR,
      `Failed to process input: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

/**
 * Read input from stdin
 */
export const readStdin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let input = '';
    
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    
    process.stdin.on('end', () => {
      resolve(input.trim());
    });
    
    process.stdin.on('error', (error) => {
      reject(new CliError(ErrorType.UNKNOWN_ERROR, `Failed to read from stdin: ${error.message}`));
    });
    
    process.stdin.resume();
  });
};

/**
 * Display help information
 */
export const showHelp = (): void => {
  console.log(`
Usage: case-converter [text] [options]

Convert text to various case formats.

Arguments:
  text                    Text to convert (if not provided, reads from stdin)

Options:
  -h, --help             Show this help message
  -v, --version          Show version information

Examples:
  case-converter "hello WORLD"
  echo "hello WORLD" | case-converter

Output formats:
  • Sentence case - First letter capitalised, rest lowercase
  • lowercase - All letters in lowercase  
  • UPPERCASE - All letters in uppercase
  • Title Case - First letter of each word capitalised
  • tOGGLE cASE - Invert the case of each letter
`);
};

/**
 * Display version information
 */
export const showVersion = (): void => {
  const packageJson = require('../package.json');
  console.log(packageJson.version);
};

/**
 * Display formatted output
 */
export const displayOutput = (output: CliOutput): void => {
  console.log(`Input: ${output.input}`);
  console.log('');
  
  output.conversions.forEach((conversion) => {
    console.log(`${conversion.label}: ${conversion.result}`);
  });
};

/**
 * Main CLI function
 */
export const main = async (args: string[] = process.argv): Promise<void> => {
  try {
    const options = parseArgs(args);

    // Handle help flag
    if (options.help) {
      showHelp();
      return;
    }

    // Handle version flag
    if (options.version) {
      showVersion();
      return;
    }

    let input: string;

    // Get input from arguments or stdin
    if (options.input) {
      input = options.input;
    } else {
      // Check if stdin has data
      if (process.stdin.isTTY) {
        throw new CliError(ErrorType.NO_INPUT, 'No input provided. Use --help for usage information.');
      }
      input = await readStdin();
    }

    // Process and display output
    const output = await processInput(input);
    displayOutput(output);

  } catch (error) {
    if (error instanceof CliError) {
      console.error(`Error: ${error.message}`);
      process.exit(error.exitCode);
    } else {
      console.error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
};
