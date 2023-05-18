import * as fs from 'fs/promises';
import * as path from 'path';
import { hashDirectory, createLockFile } from '../src/hasher';
import { createTestDirectory } from './utils';

const testDirectoryPath = './tests/test-dir';

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
    const emptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

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
