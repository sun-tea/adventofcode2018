import fs from 'fs';
import path from 'path';

export const parseFile = (filePath: string) => {
  const file = fs.readFileSync(path.resolve('inputs', filePath), 'utf8');
  return file.split('\n');
};

export const writeToFile = (filePath: string, data: string) =>
  fs.writeFile(filePath, data, () => {});
