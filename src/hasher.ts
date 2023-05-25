import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { minimatch } from 'minimatch';

export async function hashDirectory(directoryPath: string, algo: string = 'sha256', patterns: string[] = []): Promise<string> {
  try {
    const files = await getFilesRecursively(directoryPath, patterns);
    const sortedFiles = files.sort();

    const hash = crypto.createHash(algo);
    for (const file of sortedFiles) {
      const fileContent = await fs.promises.readFile(file);
      hash.update(file);
      hash.update(fileContent); // Only hash the file content
    }
    return hash.digest('hex');
  } catch (error) {
    throw error;
  }
}

async function getFilesRecursively(directoryPath: string, patterns: string[]): Promise<string[]> {
  const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });

  const filePaths = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      if (entry.isSymbolicLink()) {
        return [];  // Ignore symlinks
      } else if (entry.isDirectory()) {
        return getFilesRecursively(fullPath, patterns);
      } else if (matchesPatterns(fullPath, patterns)) {
        return [fullPath];
      } else {
        return [];
      }
    })
  );

  // Flatten the array of paths
  return Array.prototype.concat(...filePaths);
}

function matchesPatterns(filePath: string, patterns: string[]): boolean {
  return patterns.length === 0 || patterns.some(pattern => minimatch(filePath, pattern));
}

export async function isLockFileCurrent(directoryPath: string, lockFilePath: string, patterns: string[] = []): Promise<boolean> {
  try {
    const currentDirectoryHash = await hashDirectory(directoryPath, 'sha256', patterns);
    const lockFileHash = await fs.promises.readFile(lockFilePath, 'utf-8').catch(() => '');
    return lockFileHash === currentDirectoryHash;
  } catch (error) {
    return false;
  }
}

export async function createLockFile(directoryPath: string, lockFilePath: string, patterns: string[] = [], frozen: boolean = false): Promise<boolean> {
  try {
    const directoryHash = await hashDirectory(directoryPath, 'sha256', patterns);
    let existingHash = '';

    try {
      existingHash = await fs.promises.readFile(lockFilePath, 'utf-8');
    } catch (error) {
      // Ignore error in case the lock file does not exist
    }

    if (frozen) {
      const isCurrent = await isLockFileCurrent(directoryPath, lockFilePath, patterns);
      if (!isCurrent) {
        throw new Error('Lock file hash differs from the current directory hash');
      }
      return false;
    } else if (directoryHash !== existingHash) {
      await fs.promises.writeFile(lockFilePath, directoryHash, 'utf-8');
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
}
