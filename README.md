# Case Converter

[![npm version](https://badge.fury.io/js/%40shubham-tech%2Fcase-converter.svg)](https://badge.fury.io/js/%40shubham-tech%2Fcase-converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An ultra-lean and fast CLI tool for converting text to various case formats. Built with TypeScript and optimised for performance whilst maintaining readability.

## Features

- **5 Case Conversion Types**: Sentence case, lowercase, UPPERCASE, Title Case, and tOGGLE cASE
- **Multiple Input Methods**: Command-line arguments or stdin
- **High Performance**: Optimised for speed with large text inputs
- **Comprehensive Error Handling**: Robust handling of edge cases and invalid inputs
- **Unicode Support**: Works with international characters, emojis, and special symbols
- **Zero Dependencies**: Lightweight with no external runtime dependencies
- **Global Installation**: Can be run from any directory after installation

## Installation

### Global Installation (Recommended)

```bash
npm install -g case-converter
```

### Local Installation

```bash
npm install case-converter
```

### From Source

```bash
git clone https://github.com/Sharma-IT/case-converter.git
cd case-converter
npm install
npm run build
npm link
```

## Usage

### Command Line Arguments

```bash
# Convert text provided as arguments
case-converter "hello WORLD"
case-converter hello beautiful WORLD

# Show help
case-converter --help
case-converter -h

# Show version
case-converter --version
case-converter -v
```

### Stdin Input

```bash
# Pipe text from other commands
echo "hello WORLD" | case-converter

# Read from file
cat myfile.txt | case-converter

# Interactive input (type text and press Ctrl+D)
case-converter
```

### Output Format

```
Input: hello WORLD

Sentence case: Hello world
lowercase: hello world
UPPERCASE: HELLO WORLD
Title Case: Hello World
tOGGLE cASE: HELLO world
```

## Case Conversion Types

| Type | Description | Example Input | Example Output |
|------|-------------|---------------|----------------|
| **Sentence case** | First letter capitalised, rest lowercase | `hello WORLD` | `Hello world` |
| **lowercase** | All letters in lowercase | `Hello WORLD` | `hello world` |
| **UPPERCASE** | All letters in uppercase | `hello world` | `HELLO WORLD` |
| **Title Case** | First letter of each word capitalised | `hello world` | `Hello World` |
| **tOGGLE cASE** | Invert the case of each letter | `Hello World` | `hELLO wORLD` |

## Advanced Examples

### Working with Special Characters

```bash
case-converter "café naïve"
# Output includes proper handling of accented characters

case-converter "hello@world.com"
# Handles email addresses and special characters

case-converter "version-1.2.3"
# Works with version strings and hyphens
```

### Working with Unicode

```bash
case-converter "Hello 世界 WORLD"
# Supports mixed scripts and Unicode characters

case-converter "hello 🌍 WORLD!"
# Handles emojis and symbols correctly
```

### Performance with Large Inputs

```bash
# The tool efficiently handles large text files
cat large-document.txt | case-converter

# Works with very long strings
case-converter "$(cat /usr/share/dict/words | head -1000 | tr '\n' ' ')"
```

## Development

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/Sharma-IT/case-converter.git
cd case-converter

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

### Project Structure

```
case-converter/
├── src/
│   ├── types.ts          # TypeScript type definitions
│   ├── converters.ts     # Core case conversion functions
│   ├── cli.ts           # CLI interface and argument parsing
│   ├── index.ts         # Main entry point
│   └── *.test.ts        # Test files
├── dist/                # Compiled JavaScript files
├── coverage/            # Test coverage reports
├── package.json         # Package configuration
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest test configuration
└── README.md           # This file
```

### Testing

The project follows test-driven development (TDD) principles with comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/converters.test.ts

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run dev` | Watch mode for development |
| `npm run lint` | TypeScript compilation check |
| `npm start` | Run the CLI tool |

## API

### Programmatic Usage

You can also use the case converter functions programmatically:

```typescript
import { 
  toSentenceCase, 
  toLowerCase, 
  toUpperCase, 
  toTitleCase, 
  toToggleCase,
  getCaseConverters 
} from 'case-converter';

// Individual functions
const sentence = toSentenceCase('hello WORLD'); // "Hello world"
const lower = toLowerCase('Hello WORLD');       // "hello world"
const upper = toUpperCase('hello world');       // "HELLO WORLD"
const title = toTitleCase('hello world');       // "Hello World"
const toggle = toToggleCase('Hello World');     // "hELLO wORLD"

// Get all converters
const converters = getCaseConverters();
const results = Object.entries(converters).map(([type, converter]) => ({
  type,
  result: converter('hello WORLD')
}));
```

## Error Handling

The tool provides comprehensive error handling for various scenarios:

- **Empty Input**: Clear error message when no input is provided
- **Invalid Arguments**: Helpful usage information for incorrect usage
- **Large Inputs**: Performance warnings for very large text inputs
- **Unicode Edge Cases**: Graceful handling of special Unicode characters
- **System Errors**: Proper error reporting for file system or stdin issues

## Performance

- **Optimised Algorithms**: Efficient string manipulation algorithms
- **Memory Management**: Minimal memory footprint with proper cleanup
- **Large Input Handling**: Can process files with millions of characters
- **Concurrent Processing**: Supports multiple simultaneous conversions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Shubham Sharma**
- Email: shubhamsharma.emails@gmail.com
- GitHub: [@Sharma-IT](https://github.com/Sharma-IT)

## Changelog

### v1.0.0
- Initial release
- Support for 5 case conversion types
- CLI interface with argument and stdin support
- Comprehensive test suite
- Unicode and international character support
- Performance optimisations
- Error handling and edge case management
