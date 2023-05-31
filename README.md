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

### `--path`

Specifies the absolute or relative path to the directory that you want to hash. If no path is provided, it defaults to `./patches`.

Example usage:

```sh
npm run directory-hash-lock -- --path=/path/to/your/directory
```

### `--patterns`

Specifies the wildcard patterns to match the files to be included in the hash. Multiple patterns should be comma-separated. If no patterns are provided, it defaults to include all files (`**/*`).

Example usage:

```sh
npm run directory-hash-lock -- --patterns="**/*.txt,**/*.json"
```

### `--frozen-lockfile`

Prevents the tool from overwriting an existing lock file if its hash differs from the current directory hash. This can be useful if you want to ensure that the contents of the directory haven't changed.

Example usage:

```sh
npm run directory-hash-lock -- --frozen-lockfile
```

All options can be combined as needed. For instance, to hash a specific directory and only include `.txt` files, without overwriting an existing lock file, you could run:

```sh
npm run directory-hash-lock -- --path=/path/to/your/directory --patterns="**/*.txt" --frozen-lockfile
```

## API Documentation

### hashDirectory(directoryPath: string, algo: string = 'sha256', patterns: string[] = ['**/*']): Promise<string>

Generates a hash of the files in a directory and its subdirectories.

- `directoryPath`: The absolute or relative path to the directory.
- `algo`: The algorithm to be used for hashing. Defaults to 'sha256'. Other values can be any algorithm supported by Node.js `crypto` module.
- `patterns`: An array of wildcard patterns to match the files to be included in the hash. Defaults to all files (`['**/*']`).

Returns a Promise that resolves with a string representing the hexadecimal hash of the directory's contents.

### createLockFile(directoryPath: string, lockFilePath: string, patterns: string[] = ['**/*'], frozenLockfile: boolean = false): Promise<void>

Generates a hash of a directory's contents and writes it to a lock file. If the `frozenLockfile` parameter is set to `true`, it will not overwrite the existing lock file if its hash differs from the current directory hash.

- `directoryPath`: The absolute or relative path to the directory.
- `lockFilePath`: The absolute or relative path to the lock file. The lock file will be created if it does not exist.
- `patterns`: An array of wildcard patterns to match the files to be included in the hash. Defaults to all files (`['**/*']`).
- `frozenLockfile`: A boolean indicating whether the lock file should be overwritten if the hash differs. Defaults to `false`.

Returns a Promise that resolves when the lock file has been written.

## Repository

For more information, examples, and to contribute to the `directory-hash-lock` package, please visit the GitHub repository:

[https://github.com/bomjkolyadun/directory-hash-lock](https://github.com/bomjkolyadun/directory-hash-lock)
