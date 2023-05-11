import * as fs from 'fs/promises';
import * as path from 'path';
import { hashDirectory, createLockFile } from '../src/hasher';

const testDirectoryPath = './tests/test-dir';

const createTestDirectory = async () => {
  try {
    await fs.access(testDirectoryPath, fs.constants.F_OK);
  } catch {
    await fs.mkdir(testDirectoryPath, { recursive: true });
    await fs.writeFile(path.join(testDirectoryPath, 'file1.txt'), 'File 1 content', 'utf-8');
    await fs.mkdir(path.join(testDirectoryPath, 'subdir'), { recursive: true });
    await fs.writeFile(path.join(testDirectoryPath, 'subdir', 'file2.txt'), 'File 2 content', 'utf-8');
  }
};

describe('hashDirectory', () => {
  beforeAll(async () => {
    await createTestDirectory();
  });

  it('should generate a consistent hash for a given directory', async () => {
    const hash1 = await hashDirectory(testDirectoryPath);
    const hash2 = await hashDirectory(testDirectoryPath);

    expect(hash1).toEqual(hash2);
  });

  it('should include the filename in the hash', async () => {
    const file1Path = path.join(testDirectoryPath, 'file1.txt');
    const file2Path = path.join(testDirectoryPath, 'subdir', 'file2.txt');

    const file1Content = await fs.readFile(file1Path, 'utf-8');
    const file2Content = await fs.readFile(file2Path, 'utf-8');

    const hash1 = await hashDirectory(testDirectoryPath);
    const hash2 = await hashDirectory(testDirectoryPath);

    // Modify file content
    await fs.writeFile(file1Path, 'Modified content 1', 'utf-8');
    await fs.writeFile(file2Path, 'Modified content 2', 'utf-8');

    const hash3 = await hashDirectory(testDirectoryPath);

    // Restore file content
    await fs.writeFile(file1Path, file1Content, 'utf-8');
    await fs.writeFile(file2Path, file2Content, 'utf-8');

    const hash4 = await hashDirectory(testDirectoryPath);

    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(hash3);
    expect(hash1).toEqual(hash4);
  });

  afterAll(async () => {
    await fs.rm(testDirectoryPath, { recursive: true, force: true });
  });
});

describe('createLockFile', () => {
  beforeAll(async () => {
    await createTestDirectory();
  });

  const lockFilePath = './tests/test-dir.lock';

  afterEach(async () => {
    // Remove lock file after each test
    await fs.unlink(lockFilePath).catch(() => {});
  });

  it('should create a lock file with the correct hash', async () => {
    const expectedHash = await hashDirectory(testDirectoryPath);
    await createLockFile(testDirectoryPath, lockFilePath);

    const createdHash = await fs.readFile(lockFilePath, 'utf-8');
    expect(createdHash).toEqual(expectedHash);
  });

  afterAll(async () => {
    await fs.rm(testDirectoryPath, { recursive: true, force: true });
  });
});
