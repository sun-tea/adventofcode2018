// Day 8: Memory Maneuver
import { parseFile } from 'helpers';

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

const readSequencePart2 = (tree, index) => {
  if (tree[index] === 0) {
    const end = index + 2 + tree[index + 1];
    return {
      distance: end,
      metadatas: computeMetadatas(tree, index + 2, end),
    };
  }

  let sumMetadatas = 0;
  let totalDistance = index + 2;
  let childrenMetadatas = [];
  for (let i = 0; i < tree[index]; i++) {
    const { distance, metadatas } = readSequencePart2(tree, totalDistance);
    totalDistance = distance;
    childrenMetadatas.push(metadatas);
  }

  for (let i = totalDistance; i < totalDistance + tree[index + 1]; i++) {
    sumMetadatas += childrenMetadatas[tree[i] - 1] || 0;
  }

  return { distance: totalDistance + tree[index + 1], metadatas: sumMetadatas };
};

const part1 = (content) => {
  const numbers = content[0].split(' ').map((n) => parseInt(n, 10));
  return readSequence(numbers, 0).metadatas;
};

const part2 = (content) => {
  const numbers = content[0].split(' ').map((n) => parseInt(n, 10));
  return readSequencePart2(numbers, 0).metadatas;
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day8.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
