# Directory Hash Lock

![build](https://github.com/bomjkolyadun/directory-hash-lock/actions/workflows/node.js.yml/badge.svg)

`directory-hash-lock` is a lightweight and easy-to-use npm package for generating a hash of a directory's contents and creating a lock file with that hash. It's useful for detecting changes in the contents of a directory, such as verifying the integrity of files or tracking changes in version control systems.

## Features

- Generate a hash for a directory, including all its files and subdirectories.
- Create a lock file containing the hash.
- Uses SHA-256 hashing algorithm by default, but can be configured to use other algorithms supported by the Node.js `crypto` module.
- Written in TypeScript with type definitions included.
- Configurable directory path as a command-line argument, defaulting to `./patches`.

## Installation

Install the package using npm or yarn:

```sh
npm install directory-hash-lock
```

or

```sh
yarn add directory-hash-lock
```

## Usage

From the command line:

```sh
node dist/cli.js /path/to/your/directory
```

Replace `/path/to/your/directory` with the actual path of the directory you want to use. If no directory path is provided, it will default to `./patches`.

## Repository

For more information, examples, and to contribute to the `directory-hash-lock` package, please visit the GitHub repository:

[https://github.com/bomjkolyadun/directory-hash-lock](https://github.com/bomjkolyadun/directory-hash-lock)

Please feel free to update the repository with your code and documentation.
