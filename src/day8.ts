// Day 8: Memory Maneuver
import { parseFile } from 'helpers';

const part1 = (content) => {
  const numbers = content[0].split(' ').map((n) => parseInt(n, 10));

  const result = readSequence(numbers, 0);
  return result.metadatas;
};

const computeMetadatas = (tree, start, end) => {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += tree[i];
  }
  return sum;
};

const readSequence = (tree, index) => {
  if (tree[index] === 0) {
    const end = index + 2 + tree[index + 1];
    return {
      distance: end,
      metadatas: computeMetadatas(tree, index + 2, end),
    };
  }

  let sumMetadatas = 0;
  let totalDistance = index + 2;
  for (let i = 0; i < tree[index]; i++) {
    const { distance, metadatas } = readSequence(tree, totalDistance);
    totalDistance = distance;
    sumMetadatas += metadatas;
  }
  sumMetadatas += computeMetadatas(
    tree,
    totalDistance,
    totalDistance + tree[index + 1]
  );

  return { distance: totalDistance + tree[index + 1], metadatas: sumMetadatas };
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day8.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
