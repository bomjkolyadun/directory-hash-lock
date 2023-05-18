import * as fs from 'fs/promises';
import { createHash } from 'crypto';
import * as path from 'path';

export const createTestDirectory = async (testDirectoryPath: string) => {
    try {
        await fs.access(testDirectoryPath, fs.constants.F_OK);
    } catch {
        await fs.mkdir(testDirectoryPath, { recursive: true });
        await fs.writeFile(path.join(testDirectoryPath, 'file1.txt'), 'File 1 content', 'utf-8');
        await fs.mkdir(path.join(testDirectoryPath, 'subdir'), { recursive: true });
        await fs.writeFile(path.join(testDirectoryPath, 'subdir', 'file2.txt'), 'File 2 content', 'utf-8');
    }
};

export function hashString(data: string, algo: string = 'sha256'): string {
    const hash = createHash(algo);
    hash.update(data);
    return hash.digest('hex');
}
