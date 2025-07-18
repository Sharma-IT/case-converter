import { spawn } from 'child_process';
import { join } from 'path';

const CLI_PATH = join(__dirname, '../dist/cli.js');

describe('CLI Integration Tests', () => {
  // Helper function to run CLI and capture output
  const runCli = (args: string[] = [], input?: string): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }> => {
    return new Promise((resolve) => {
      const child = spawn('node', [CLI_PATH, ...args], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code || 0
        });
      });

      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      } else {
        child.stdin.end();
      }
    });
  };

  beforeAll(async () => {
    // Ensure the CLI is built before running integration tests
    const { spawn: spawnSync } = require('child_process');
    await new Promise<void>((resolve, reject) => {
      const build = spawnSync('npm', ['run', 'build'], { 
        stdio: 'inherit',
        cwd: join(__dirname, '..')
      });
      build.on('close', (code: number | null) => {
        if (code === 0) resolve();
        else reject(new Error(`Build failed with code ${code}`));
      });
    });
  }, 30000);

  describe('Command Line Arguments', () => {
    it('should convert text from command line arguments', async () => {
      const result = await runCli(['hello WORLD']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Input: hello WORLD');
      expect(result.stdout).toContain('Sentence case: Hello world');
      expect(result.stdout).toContain('lowercase: hello world');
      expect(result.stdout).toContain('UPPERCASE: HELLO WORLD');
      expect(result.stdout).toContain('Title Case: Hello World');
      expect(result.stdout).toContain('tOGGLE cASE: HELLO world');
    });

    it('should handle multiple word arguments', async () => {
      const result = await runCli(['hello', 'beautiful', 'WORLD']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Input: hello beautiful WORLD');
      expect(result.stdout).toContain('Sentence case: Hello beautiful world');
    });

    it('should show help when --help flag is used', async () => {
      const result = await runCli(['--help']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('case-converter');
      expect(result.stdout).toContain('Options:');
    });

    it('should show help when -h flag is used', async () => {
      const result = await runCli(['-h']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Usage:');
    });

    it('should show version when --version flag is used', async () => {
      const result = await runCli(['--version']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('1.0.0');
    });

    it('should show version when -v flag is used', async () => {
      const result = await runCli(['-v']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('1.0.0');
    });
  });

  describe('Stdin Input', () => {
    it('should convert text from stdin', async () => {
      const result = await runCli([], 'hello WORLD');
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Input: hello WORLD');
      expect(result.stdout).toContain('Sentence case: Hello world');
      expect(result.stdout).toContain('lowercase: hello world');
      expect(result.stdout).toContain('UPPERCASE: HELLO WORLD');
      expect(result.stdout).toContain('Title Case: Hello World');
      expect(result.stdout).toContain('tOGGLE cASE: HELLO world');
    });

    it('should handle multiline input from stdin', async () => {
      const result = await runCli([], 'hello\nWORLD');
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Input: hello\nWORLD');
    });
  });

  describe('Error Handling', () => {
    it('should show error when no input is provided', async () => {
      const result = await runCli([]);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('No input provided');
    });

    it('should show error for empty stdin', async () => {
      const result = await runCli([], '');
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('No input provided');
    });

    it('should show error for whitespace-only input', async () => {
      const result = await runCli(['   ']);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('No input provided');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters', async () => {
      const result = await runCli(['hello@#$%^&*()WORLD123']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Input: hello@#$%^&*()WORLD123');
    });

    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(1000) + 'B'.repeat(1000);
      const result = await runCli([longString]);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`Input: ${longString}`);
    });

    it('should handle unicode characters', async () => {
      const result = await runCli(['héllo WÖRLD']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Input: héllo WÖRLD');
    });
  });
});
