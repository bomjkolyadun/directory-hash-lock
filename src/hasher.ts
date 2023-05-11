import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export function hashDirectory(directoryPath: string, algo: string = 'sha256'): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const files = await getFilesRecursively(directoryPath);
      const sortedFiles = files.sort();

      const hash = crypto.createHash(algo);
      for (const file of sortedFiles) {
        const fileContent = await fs.promises.readFile(file);
        hash.update(file);
        hash.update(fileContent);
      }

      resolve(hash.digest('hex'));
    } catch (error) {
      reject(error);
    }
  });
}

async function getFilesRecursively(directoryPath: string): Promise<string[]> {
  const entries = await fs.promises.readdir(directoryPath, { withFileTypes: true });
  const filePaths = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directoryPath, entry.name);
      return entry.isDirectory()
        ? getFilesRecursively(fullPath)
        : fullPath;
    })
  );

  return Array.prototype.concat(...filePaths);
}

export async function createLockFile(directoryPath: string, lockFilePath: string): Promise<void> {
  try {
    const directoryHash = await hashDirectory(directoryPath);
    await fs.promises.writeFile(lockFilePath, directoryHash, 'utf-8');
  } catch (error) {
    throw error;
  }
}
