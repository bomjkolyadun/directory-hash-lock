import * as fs from 'fs/promises';
import * as path from 'path';
import { hashDirectory, createLockFile } from '../src/hasher';
import { createTestDirectory } from './utils';

const testDirectoryPath = './tests/test-dir';
const emptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

describe('hashDirectory', () => {
  beforeAll(async () => {
    await createTestDirectory(testDirectoryPath);
  });

  it('should generate a consistent hash for a given directory', async () => {
    const hash1 = await hashDirectory(testDirectoryPath);
    const hash2 = await hashDirectory(testDirectoryPath);

    expect(hash1).toEqual(hash2);
  });

  it('should only hash files matching the provided patterns', async () => {
    const hash1 = await hashDirectory(testDirectoryPath, 'sha256', ['**/file1.txt']);
    const hash2 = await hashDirectory(testDirectoryPath, 'sha256', ['**/*.txt']);

    expect(hash1).not.toEqual(hash2);

    const file2Path = path.join(testDirectoryPath, 'subdir', 'file2.txt');
    const file2Content = await fs.readFile(file2Path, 'utf-8');

    // Modify a file that is not included in the hash
    await fs.writeFile(file2Path, 'Modified content', 'utf-8');

    const hash3 = await hashDirectory(testDirectoryPath, 'sha256', ['**/file1.txt']);

    // Restore file content
    await fs.writeFile(file2Path, file2Content, 'utf-8');

    expect(hash1).toEqual(hash3);
  });

  it('should only hash files matching the provided patterns', async () => {
    const hash1 = await hashDirectory(testDirectoryPath, 'sha256', ['**/file1.txt']);
    const hash2 = await hashDirectory(testDirectoryPath, 'sha256', ['**/*.txt']);

    const hashAll = await hashDirectory(testDirectoryPath, 'sha256', []);

    expect(hash1).not.toEqual(hash2);

    const file2Path = path.join(testDirectoryPath, 'subdir', 'file2.txt');
    const file2Content = await fs.readFile(file2Path, 'utf-8');

    // Modify a file that is not included in the hash
    await fs.writeFile(file2Path, 'Modified content', 'utf-8');

    const hash3 = await hashDirectory(testDirectoryPath, 'sha256', ['**/file1.txt']);

    // Restore file content
    await fs.writeFile(file2Path, file2Content, 'utf-8');

    expect(hash1).toEqual(hash3);
    expect(emptyHash).not.toEqual(hash3);
    expect(emptyHash).not.toEqual(hash2);
    expect(emptyHash).not.toEqual(hash1);
    expect(emptyHash).not.toEqual(hashAll);
  });

  afterAll(async () => {
    await fs.rm(testDirectoryPath, { recursive: true, force: true });
  });
});

describe('hashDirectory on identical dirs', () => {
  const testDir1 = './tests/test-dir-1';
  const testDir2 = './tests/test-dir-2';

  beforeEach(async () => {
    // Create the directories if they don't exist
    await fs.mkdir(testDir1, { recursive: true });
    await fs.mkdir(testDir2, { recursive: true });

    // Create a file in each directory
    await fs.writeFile(path.join(testDir1, 'file1.txt'), 'Same content');
    await fs.writeFile(path.join(testDir2, 'file2.txt'), 'Same content');
  });

  afterEach(async () => {
    // Clean up: remove the directories and their contents
    await fs.rm(testDir1, { recursive: true, force: true });
    await fs.rm(testDir2, { recursive: true, force: true });
  });

  it('should produce the same hash for directories with different file names but same contents', async () => {
    const hash1 = await hashDirectory(testDir1);
    const hash2 = await hashDirectory(testDir2);
    expect(hash1).not.toEqual(hash2);
    expect(hash1).not.toEqual(emptyHash);
    expect(hash2).not.toEqual(emptyHash);
  });
});

describe('createLockFile', () => {
  beforeAll(async () => {
    await createTestDirectory(testDirectoryPath);
  });

  const lockFilePath = './tests/test-dir.lock';

  afterEach(async () => {
    // Remove lock file after each test
    await fs.unlink(lockFilePath).catch(() => { });
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
