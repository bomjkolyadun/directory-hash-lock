#!/usr/bin/env node
import { createLockFile } from "./hasher";
import { parseArgs } from "./argsParser";

const { directoryPath, patterns, lockFilePath } = parseArgs(process.argv.slice(2));

createLockFile(directoryPath, lockFilePath, patterns)
  .then((wasCreatedOrUpdated) => {
    if (wasCreatedOrUpdated) {
      console.log(`${lockFilePath} created or updated.`);
    } else {
      console.log(`No changes detected in ${directoryPath}.`);
    }
  })
  .catch(error => console.error('Error creating or updating lock file:', error));
