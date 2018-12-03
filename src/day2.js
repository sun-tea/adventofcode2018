// Day 2: Inventory Management System

import fs from 'fs';
import path from 'path';

const parseFile = (filePath: string = 'day2.txt') => {
  const file = fs.readFileSync(path.resolve('inputs', filePath), 'utf8');
  const content = file.split('\n');
  console.log(`part1: ${part1(content)}`);
};

const part1 = ids => {
  const occurences = ids.reduce((acc, id) => {
    let two = false;
    let three = false;

    id.split('').map(letter => {
      const count = (id.match(new RegExp(letter, 'g')) || []).length;
      if (count === 2) {
        two = true;
      } else if (count === 3) {
        three = true;
      }
    });

    return [...acc, { two, three }];
  }, []);

  return (
    occurences.filter(occ => occ.two).length *
    occurences.filter(occ => occ.three).length
  );
};

(() => {
  const args = process.argv.slice(2);
  parseFile(args[0]);
})();
