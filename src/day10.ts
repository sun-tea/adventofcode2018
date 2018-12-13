// Day 10: The Stars Align
import { parseFile } from 'helpers';

const printSky = (stars) => {
  let minX = stars[0].x;
  let minY = stars[0].y;
  let maxX = stars[0].x;
  let maxY = stars[0].y;

  stars.map((star) => {
    minX = minX > star.x ? star.x : minX;
    maxX = maxX < star.x ? star.x : maxX;
    minY = minY > star.y ? star.y : minY;
    maxY = maxY < star.y ? star.y : maxY;
  });

  let printedSky = '';
  for (let i = minY - 2; i <= maxY + 2; i++) {
    for (let j = minX - 2; j <= maxX + 2; j++) {
      if (stars.find((star) => star.x === j && star.y === i)) {
        printedSky += '#';
      } else {
        printedSky += '.';
      }
    }
    printedSky += '\n';
  }

  return printedSky;
};

const computeMeasurement = (stars) => {
  let width = 0;
  let height = 0;
  stars.map((star, index) => {
    for (let i = index; i < stars.length; i++) {
      const xDiff = Math.abs(star.x - stars[i].x);
      const yDiff = Math.abs(star.y - stars[i].y);
      width = xDiff > width ? xDiff : width;
      height = yDiff > height ? yDiff : height;
    }
  });
  return { width: width, height: height };
};

const part1 = (content) => {
  const regex = /.+?(-?\d+).+?(-?\d+).+?(-?\d+).+?(-?\d+).+?/g;

  let position;
  const stars = [];
  const sky = [];
  const measurements = [];

  while ((position = regex.exec(content)) !== null) {
    const [, x, y, moveX, moveY] = position.map((i) => parseInt(i, 10));
    stars.push({ x, y, moveX, moveY });
    regex.lastIndex;
  }

  sky.push(stars);
  measurements.push(computeMeasurement(stars));

  do {
    sky.push(
      sky[sky.length - 1].map((star, i) => ({
        x: star.x + stars[i].moveX,
        y: star.y + stars[i].moveY,
      }))
    );

    measurements.push(computeMeasurement(sky[sky.length - 1]));
  } while (
    measurements[measurements.length - 1].width <=
      measurements[measurements.length - 2].width &&
    measurements[measurements.length - 1].height <=
      measurements[measurements.length - 2].height
  );

  return printSky(sky[sky.length - 2]);
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day10.txt';
  const content = parseFile(filePath);
  console.log(`part1: \n${part1(content)}`);
})();
