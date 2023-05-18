import { parseArgs } from '../src/argsParser';

describe('argsParser', () => {
    it('should parse command-line arguments correctly', () => {
        const args = ['--path=test/path', '--patterns=*.js,*.ts'];
        const { directoryPath, patterns, lockFilePath } = parseArgs(args);

        expect(directoryPath).toBe('test/path');
        expect(patterns).toEqual(['*.js', '*.ts']);
        expect(lockFilePath).toBe('test/path.lock');
    });

    it('should provide default values if arguments are not given', () => {
        const args: string[] = [];
        const { directoryPath, patterns, lockFilePath } = parseArgs(args);

        expect(directoryPath).toBe('./patches');
        expect(patterns).toEqual([]);
        expect(lockFilePath).toBe('./patches.lock');
    });
});
