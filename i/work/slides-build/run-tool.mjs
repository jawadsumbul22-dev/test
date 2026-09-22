import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';
import { pathToFileURL } from 'node:url';

// Windows adapter for the bundled helpers' read-only unzip calls.
const spawn = childProcess.spawnSync;
childProcess.spawnSync = (command, args = [], options = {}) => {
  if (command === 'unzip') {
    const py = 'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
    if (args[0] === '-Z1') return spawn(py, ['-c', 'import sys,zipfile; print("\\n".join(zipfile.ZipFile(sys.argv[1]).namelist()))', args[1]], options);
    if (args[0] === '-p') return spawn(py, ['-c', 'import sys,zipfile; sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))', args[1], args[2]], options);
  }
  return spawn(command, args, options);
};
syncBuiltinESMExports();
const target = process.argv[2];
process.argv = [process.argv[0], target, ...process.argv.slice(3)];
await import(pathToFileURL(target));
