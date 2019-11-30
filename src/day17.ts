// Day 17: Reservoir Research
import { parseFile, writeToFile } from './helpers';

const regex = new RegExp('(x|y)?=?(\\d+)', 'g');

export const displayMap = map => {
  const lengthOfColumns = map.length;
  const lengthOfRows = map.reduce(
    (max, row) => (row.length > max ? row.length : max),
    0
  );

  let output = [''];
  for (let x = 0; x < lengthOfColumns; x++) {
    for (let y = 0; y < lengthOfRows; y++) {
      const value = map[x] && map[x][y] ? map[x][y] : '.';
      if (output[y]) {
        output[y] += value;
      } else {
        output[y] = value;
      }
    }
  }

  return output.join('\n');
};

const part1 = (content: string[]) => {
  const map = [];
  map[500] = ['+'];

  content.forEach((line: string, y: number) => {
    const [axis1, axis2_start, axis2_end] = line.match(regex);

    const [axis1name, axis1_value] = axis1.split('=');
    const [, axis2_value] = axis2_start.split('=');

    const firstValue = parseInt(axis1_value, 10);
    const start = parseInt(axis2_value, 10);
    const end = parseInt(axis2_end, 10);

    for (let i = start; i < end + 1; i++) {
      if (axis1name === 'x') {
        if (!map[firstValue]) {
          map[firstValue] = [];
        }
        map[firstValue][i] = '#';
      } else {
        if (!map[i]) {
          map[i] = [];
        }
        map[i][firstValue] = '#';
      }
    }
  });
  const output = displayMap(map);

  writeToFile('src/day17_output.txt', output);
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day17.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
