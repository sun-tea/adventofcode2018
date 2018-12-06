// Day 6: Chronal Coordinates
import { parseFile } from 'helpers';

const compose = (...fns) => (x) => fns.reduceRight((y, f) => f(y), x);

const getGridSize = (content) =>
  content.reduce(
    ({ maxX, maxY }, point) => {
      const [x, y] = point.split(', ');
      return {
        maxX: parseInt(x, 10) > maxX ? parseInt(x, 10) : maxX,
        maxY: parseInt(y, 10) > maxY ? parseInt(y, 10) : maxY,
      };
    },
    { maxX: 0, maxY: 0 }
  );

const getDiff = (a, b) => Math.abs(parseInt(a, 10) - parseInt(b, 10));

const getManhattanDistance = ({ a1, b1 }, { a2, b2 }) =>
  getDiff(a1, a2) + getDiff(b1, b2);

const getAllDistancesFromSpecificPoint = (args) => {
  const {
    coords,
    pos: { a1, b1 },
  } = args;
  return coords.reduce(
    (distances, [a2, b2]) => [
      ...distances,
      getManhattanDistance({ a1, b1 }, { a2, b2 }),
    ],
    []
  );
};

const getClosestPointIndex = (distances) => {
  const min = Math.min(...distances);
  const closestPoint = distances.filter((d) => d === min);
  return closestPoint.length === 1 ? distances.findIndex((d) => d === min) : '.';
};

const getClosestCoord = compose(
  getClosestPointIndex,
  getAllDistancesFromSpecificPoint
);

const getGrid = (content) => {
  const { maxX, maxY } = getGridSize(content);
  const coords = content.map((pair) => pair.split(', '));
  let grid = [];
  for (let a1 = 0; a1 < maxX + 2; a1++) {
    for (let b1 = 0; b1 < maxY + 2; b1++) {
      if (!grid[b1]) {
        grid[b1] = [];
      }
      grid[b1][a1] = getClosestCoord({ coords, pos: { a1, b1 } });
    }
  }
  return grid;
};

const exclude = (infiniteAreasIndexes, value) => {
  const newValue =
    value !== '.' &&
    infiniteAreasIndexes.find((area) => area === value) === undefined
      ? [value]
      : [];
  return [...infiniteAreasIndexes, ...newValue];
};

const part1 = (content) => {
  const grid = getGrid(content);
  const limits = [
    ...grid[0],
    ...grid[grid.length - 1],
    ...grid.reduce((acc, row) => [...acc, row[0], row[row.length - 1]], []),
  ];
  const infiniteAreas = limits.reduce(exclude, []);

  const finiteAreas = content.reduce((areas, coords, i) => {
    const newValue = infiniteAreas.find((a) => a === i) === undefined ? [i] : [];
    return [...areas, ...newValue];
  }, []);

  const finiteSurfaces = finiteAreas.map((area) => ({
    area,
    surface: grid.reduce(
      (sum, row) =>
        sum +
        row.reduce(
          (sum, pos) =>
            pos !== '.' && parseInt(pos, 10) === parseInt(area, 10)
              ? ++sum
              : sum,
          0
        ),
      0
    ),
  }));

  return Math.max(...finiteSurfaces.map((s) => s.surface));
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day6.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
