// Day 1: Chronal Calibration

import fs from 'fs';
import path from 'path';

const parseFile = (filePath: string = 'day1.txt') => {
  const file = fs.readFileSync(path.resolve('inputs', filePath), 'utf8');
  const content = file.split('\n');
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
};

const part1 = content =>
  content.reduce((acc, val) => Number(acc) + Number(val), 0);
const part2 = content => {
  let total = 0;
  let acc = [total];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let i = 0; i < content.length; i++) {
      total += Number(content[i]);
      if (acc.includes(total)) {
        return total;
      }
      acc.push(total);
    }
  }
};

(() => {
  const args = process.argv.slice(2);
  parseFile(args[0]);
})();
