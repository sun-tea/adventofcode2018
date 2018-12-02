import fs from 'fs';
import path from 'path';

const parseFile = (filePath: string = 'input.day1.txt') => {
  const file = fs.readFileSync(path.resolve('inputs', filePath), 'utf8');

  const lines = file.split('\n');
  return lines.reduce((acc, val) =>
    Number(acc) + Number(val)
  , 0);

};

(() => {
  const args = process.argv.slice(2);
  console.log(parseFile(args[0]));
})();