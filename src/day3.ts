// Day 3: No Matter How You Slice It
import { parseFile } from 'helpers';

type Claim = {
  id: number;
  x: number;
  y: number;
  weight: number;
  height: number;
};

const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const getClaims = (content): Claim[] => {
  const regex = new RegExp('^#(\\d+)\\s@\\s(\\d+),(\\d+):\\s(\\d+)x(\\d+)$');

  return content.map((line) => {
    const [, id, x, y, weight, height] = regex
      .exec(line)
      .map((i) => parseInt(i, 10));
    return {
      id,
      x,
      y,
      weight,
      height,
    };
  });
};

const getFabric = (claims: Claim[]): number[][] => {
  const fabric = [];
  claims.forEach((claim) => {
    for (let i = claim.x; i < claim.x + claim.weight; i++) {
      if (!fabric[i]) {
        fabric[i] = [];
      }

      for (let j = claim.y; j < claim.y + claim.height; j++) {
        fabric[i][j] = (fabric[i][j] || 0) + 1;
      }
    }
  });

  return fabric;
};

const part1 = (content) => {
  const fabric = compose(
    getFabric,
    getClaims
  )(content);
  return fabric.reduce(
    (sumRow, row) =>
      sumRow +
      row.reduce((sum, inch) => (!isNaN(inch) && inch > 1 ? ++sum : sum), 0),
    0
  );
};

const part2 = (content) => {
  const claims = getClaims(content);
  const fabric = getFabric(claims);

  for (let claim of claims) {
    let abortCurrentClaimCheck = false;
    for (let i = claim.x; i < claim.x + claim.weight; i++) {
      for (let j = claim.y; j < claim.y + claim.height; j++) {
        if (fabric[i][j] > 1) {
          abortCurrentClaimCheck = true;
          break;
        }
      }
      if (abortCurrentClaimCheck) {
        break;
      } else if (i === claim.x + claim.weight - 1) {
        return claim.id;
      }
    }
  }
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day3.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
