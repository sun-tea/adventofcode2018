// Day 5: Chronal Calibration
import { parseFile } from 'helpers';

const triggerPolymerReaction = polymer => {
  let index = 0;
  const lower = /[a-z]/;
  const upper = /[A-Z]/;
  while (index < polymer.length - 1) {
    const a = polymer.charAt(index);
    const b = polymer.charAt(index + 1);
    if (
      a.toLowerCase() === b.toLowerCase() &&
      ((lower.exec(a) && upper.exec(b)) || (lower.exec(b) && upper.exec(a)))
    ) {
      polymer = `${polymer.slice(0, index)}${polymer.slice(index + 2)}`;
      index -= 2;
    } else {
      index++;
    }
  }
  return polymer;
};

const part1 = content => triggerPolymerReaction(content).length;
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day5.txt';
  const [content] = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  // console.log(`part2: ${part2(content)}`);
})();
