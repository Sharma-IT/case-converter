#!/usr/bin/env node

/**
 * Case Converter CLI
 * Ultra-lean and fast CLI tool for converting text to various case formats
 */

import { main } from './cli';

// Run the CLI
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export * from './types';
export * from './converters';
export * from './cli';
