// Day 3: No Matter How You Slice It
import { parseFile } from 'helpers';

const part1 = content => {
  const regex = new RegExp('^#(\\d+)\\s@\\s(\\d+),(\\d+):\\s(\\d+)x(\\d+)$');

  const claims = content.map(line => {
    const [, id, x, y, weight, height] = regex
      .exec(line)
      .map(i => parseInt(i, 10));
    return {
      id,
      x,
      y,
      weight,
      height,
    };
  });

  const fabric = [];
  claims.forEach(claim => {
    for (let i = claim.x; i < claim.x + claim.weight; i++) {
      if (!fabric[i]) {
        fabric[i] = [];
      }

      for (let j = claim.y; j < claim.y + claim.height; j++) {
        fabric[i][j] = (fabric[i][j] || 0) + 1;
      }
    }
  });

  return fabric.reduce(
    (sumRow, row) =>
      sumRow +
      row.reduce((sum, inch) => (!isNaN(inch) && inch > 1 ? ++sum : sum), 0),
    0
  );
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day3.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
