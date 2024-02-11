import { exec, execSync } from 'child_process';
import os from 'os';
import logger from 'electron-log';

export function extractPids(processes: string): number[] {
  const isWin = os.platform() === 'win32';
  return processes
    .trim()
    .split('\n')
    .filter((line) => !line.includes('grep'))
    .map((line) => {
      if (isWin) {
        const parts = line.trim().split(' ').filter(Boolean);
        return parseInt(parts[1], 10); // On Windows, PID is the second column
      } else {
        const [raw] = line.trim().split(' ');
        return parseInt(raw, 10);
      }
    });
}

export function findPid(processes: string): number | undefined {
  const [ipfsProcess] = extractPids(processes);
  return ipfsProcess;
}

export function getPidSync(search: string): number | undefined {
  try {
    const processes = execSync(`ps -ax | grep "${search}"`, {
      encoding: 'utf8',
    });
    return findPid(processes);
  } catch (_e) {
    // whatever
  }
}

export function getPidsSync(search: string): number[] {
  try {
    const processes = execSync(`ps -ax | grep '${search}'`, {
      encoding: 'utf8',
    });
    return extractPids(processes);
  } catch (_e) {
    return [];
  }
}

function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        error.message = `${error.message} (${stderr})`;
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

export async function getPid(search: string): Promise<number | undefined> {
  const command =
    os.platform() === 'win32' ? `tasklist | findstr "${search}"` : `ps -ax | grep '${search}'`;
  try {
    const processes = await execCommand(command);
    return findPid(processes);
  } catch (_e) {
    logger.error(_e);
  }
}
