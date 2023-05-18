#!/usr/bin/env node
import { createLockFile } from "./hasher";
import { parseArgs } from "./argsParser";

const { directoryPath, patterns, lockFilePath } = parseArgs(process.argv.slice(2));

createLockFile(directoryPath, lockFilePath, patterns)
  .then(() => console.log('Lock file created.'))
  .catch(error => console.error('Error creating lock file:', error));
