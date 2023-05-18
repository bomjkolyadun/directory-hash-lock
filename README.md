# Directory Hash Lock

![build](https://github.com/bomjkolyadun/directory-hash-lock/actions/workflows/node.js.yml/badge.svg)

`directory-hash-lock` is a lightweight and easy-to-use npm package for generating a hash of a directory's contents and creating a lock file with that hash. It's useful for detecting changes in the contents of a directory, such as verifying the integrity of files or tracking changes in version control systems.

## Features

- Generate a hash for a directory, including all its files and subdirectories.
- Filter files included in the hash using wildcard patterns.
- Create a lock file containing the hash.
- Uses SHA-256 hashing algorithm by default, but can be configured to use other algorithms supported by the Node.js `crypto` module.
- Written in TypeScript with type definitions included.
- Configurable directory path and file patterns as command-line arguments, defaulting to `./patches` and `**/*` respectively.

## Installation

Install the package using npm or yarn as a dev dependency:

```sh
npm install --save-dev directory-hash-lock
```

or

```sh
yarn add --dev directory-hash-lock
```

## Usage

From the command line (yarn):

```sh
yarn run directory-hash-lock --path=/path/to/your/directory --patterns="**/*.txt,**/*.json"

```

npm:

```sh
npm run directory-hash-lock --path=/path/to/your/directory --patterns="**/*.txt,**/*.json"

```

Replace `/path/to/your/directory` with the actual path of the directory you want to use and `**/*.txt,**/*.json` with your desired file patterns (comma-separated). If no directory path is provided, it will default to `./patches`. If no patterns are provided, it will default to include all files (`**/*`).

## API Documentation

### hashDirectory(directoryPath: string, algo: string = 'sha256', patterns: string[] = ['**/*']): Promise<string>

Generates a hash of the files in a directory and its subdirectories.

- `directoryPath`: The absolute or relative path to the directory.
- `algo`: The algorithm to be used for hashing. Defaults to 'sha256'. Other values can be any algorithm supported by Node.js `crypto` module.
- `patterns`: An array of wildcard patterns to match the files to be included in the hash. Defaults to all files (`['**/*']`).

Returns a Promise that resolves with a string representing the hexadecimal hash of the directory's contents.

### createLockFile(directoryPath: string, lockFilePath: string, algo: string = 'sha256', patterns: string[] = ['**/*']): Promise<void>

Generates a hash of a directory's contents and writes it to a lock file.

- `directoryPath`: The absolute or relative path to the directory.
- `lockFilePath`: The absolute or relative path to the lock file. The lock file will be created if it does not exist.
- `algo`: The algorithm to be used for hashing. Defaults to 'sha256'. Other values can be any algorithm supported by Node.js `crypto` module.
- `patterns`: An array of wildcard patterns to match the files to be included in the hash. Defaults to all files (`['**/*']`).

Returns a Promise that resolves when the lock file has been written.

## Repository

For more information, examples, and to contribute to the `directory-hash-lock` package, please visit the GitHub repository:

[https://github.com/bomjkolyadun/directory-hash-lock](https://github.com/bomjkolyadun/directory-hash-lock)
