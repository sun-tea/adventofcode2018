// Day 11: Chronal Charge

const getFuelCellValue = (x: number, y: number, serialNumber: number) => {
  const value = ((x + 10) * y + serialNumber) * (x + 10);
  if (value / 100 > 1) {
    let result = value.toString();
    result = result.slice(result.length - 3, result.length - 2);
    return (result ? parseInt(result, 10) : 0) - 5;
  } else {
    return 0;
  }
};

const sumOfSquare = (
  size: number,
  x: number,
  y: number,
  summedAreaTable: number[]
) =>
  summedAreaTable[x][y] -
  (summedAreaTable[x - size] ? summedAreaTable[x - size][y] : 0) -
  (summedAreaTable[x][y - size] ? summedAreaTable[x][y - size] : 0) +
  (summedAreaTable[x - size] && summedAreaTable[x - size][y - size]
    ? summedAreaTable[x - size][y - size]
    : 0);

const getCoordsOfTopLeftSquare = (serialNumber: number, size: number) => {
  const summedAreaTable = [];
  const summedSquareTable = [];

  for (let i = 0; i < 300; i++) {
    summedAreaTable[i] = [];
    summedSquareTable[i] = [];
    for (let j = 0; j < 300; j++) {
      const fuelCellValue = getFuelCellValue(i + 1, j + 1, serialNumber);
      summedAreaTable[i][j] =
        fuelCellValue +
        (summedAreaTable[i][j - 1] ? summedAreaTable[i][j - 1] : 0) +
        (summedAreaTable[i - 1] ? summedAreaTable[i - 1][j] : 0) -
        (summedAreaTable[i - 1] && summedAreaTable[i - 1][j - 1]
          ? summedAreaTable[i - 1][j - 1]
          : 0);
      summedSquareTable[i][j] = sumOfSquare(size, i, j, summedAreaTable);
    }
  }

  let maxFuelValue = summedSquareTable[0][0];
  let x: number;
  let y: number;
  summedSquareTable.map((row, i) => {
    row.map((cell, j) => {
      if (maxFuelValue < cell) {
        maxFuelValue = cell;
        x = i - size + 2 || null;
        y = j - size + 2 || null;
      }
    });
  });
  return { x, y, maxFuelValue };
};

const part1 = (serialNumber: number) =>
  getCoordsOfTopLeftSquare(serialNumber, 3);

const part2 = (serialNumber: number) => {
  let size = 1;
  let { x: xMax, y: yMax, maxFuelValue: maxFuel } = getCoordsOfTopLeftSquare(
    serialNumber,
    size
  );

  for (let i = 2; i <= 300; i++) {
    const { x, y, maxFuelValue } = getCoordsOfTopLeftSquare(serialNumber, i);
    if (maxFuelValue > maxFuel) {
      maxFuel = maxFuelValue;
      xMax = x;
      yMax = y;
      size = i;
    }
  }

  return { xMax, yMax, size };
};

(() => {
  const { x, y } = part1(8141);
  console.log(`part1: {${x}, ${y}}`);
  const { xMax, yMax, size } = part2(8141);
  console.log(`part2: {${xMax}, ${yMax}, ${size}}`);
})();
