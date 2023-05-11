#!/usr/bin/env node
import { createLockFile } from "./hasher";

const [directoryPath = './patches'] = process.argv.slice(2);
const lockFilePath = `${directoryPath}.lock`;

createLockFile(directoryPath, lockFilePath)
  .then(() => console.log('Lock file created.'))
  .catch(error => console.error('Error creating lock file:', error));
