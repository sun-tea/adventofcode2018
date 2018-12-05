// Day 5: Chronal Calibration
import { parseFile } from 'helpers';

const part1 = content => {
  let index = 0;
  const lower = /[a-z]/;
  const upper = /[A-Z]/;
  while (index < content.length - 1) {
    const a = content.charAt(index);
    const b = content.charAt(index + 1);
    if (
      a.toLowerCase() === b.toLowerCase() &&
      ((lower.exec(a) && upper.exec(b)) || (lower.exec(b) && upper.exec(a)))
    ) {
      content = `${content.slice(0, index)}${content.slice(index + 2)}`;
      index -= 2;
    } else {
      index++;
    }
  }
  return content.length;
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day5.txt';
  const [content] = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  // console.log(`part2: ${part2(content)}`);
})();
