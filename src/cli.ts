#!/usr/bin/env node
import { createLockFile } from "./hasher";

const args = process.argv.slice(2);
const argMap = args.reduce<{ [key: string]: string }>((acc, arg) => {
  const [key, value] = arg.split('=');
  acc[key] = value;
  return acc;
}, {});

const directoryPath = argMap['--path'] || './patches';
const patterns = argMap['--patterns'] ? argMap['--patterns'].split(',') : [];
const lockFilePath = `${directoryPath}.lock`;

createLockFile(directoryPath, lockFilePath, patterns)
  .then(() => console.log('Lock file created.'))
  .catch(error => console.error('Error creating lock file:', error));
