export function parseArgs(args: string[]): { directoryPath: string; patterns: string[]; lockFilePath: string; frozen: boolean } {
  const argMap = args.reduce<{ [key: string]: string }>((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const directoryPath = argMap['--path'] || './patches';
  const patterns = argMap['--patterns'] ? argMap['--patterns'].split(',') : [];
  const lockFilePath = `${directoryPath}.lock`;
  const frozen = args.includes('--frozen-lockfile');

  return { directoryPath, patterns, lockFilePath, frozen };
}
