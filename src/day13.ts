// Day 13: Mine Cart Madness
import { parseFile } from 'helpers';

const moveCarts = (content) => {
  // 0: left, 1: straight, 2: right
  const states = {
    0: {
      next: 1,
    },
    1: {
      next: 2,
    },
    2: {
      next: 0,
    },
  };
  const cartsDirection = {
    '^': {
      0: '<',
      1: '^',
      2: '>',
    },
    v: {
      0: '>',
      1: 'v',
      2: '<',
    },
    '<': {
      0: 'v',
      1: '<',
      2: '^',
    },
    '>': {
      0: '^',
      1: '>',
      2: 'v',
    },
  };
  const carts = ['^', 'v', '<', '>'];
  const cartsMap = [];
  const map = [];

  content.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      map[x] = map[x] ? map[x] : [];
      if (carts.includes(char)) {
        cartsMap.push({ x, y, direction: char, state: 0, isDestroyed: false });
        char = ['<', '>'].includes(char) ? '-' : '|';
      }
      map[x][y] = char;
    });
  });

  cartsMap.sort((a, b) => a.y - b.y || a.x - b.x);

  let crashCoords = [];

  while (cartsMap.filter((cart) => !cart.isDestroyed).length > 1) {
    cartsMap
      .filter((cart) => !cart.isDestroyed)
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .forEach((cart, i, arr) => {
        let next;
        switch (cart.direction) {
          case '^':
            next = { x: cart.x, y: cart.y - 1 };
            break;
          case 'v':
            next = { x: cart.x, y: cart.y + 1 };
            break;
          case '<':
            next = { x: cart.x - 1, y: cart.y };
            break;
          case '>':
            next = { x: cart.x + 1, y: cart.y };
            break;
        }

        const collisioningCart = arr.findIndex(
          (cart) => cart.x === next.x && cart.y === next.y
        );
        if (collisioningCart !== -1) {
          arr[i].isDestroyed = true;
          arr[collisioningCart].isDestroyed = true;
          crashCoords.push({ x: next.x, y: next.y });
        } else {
          switch (map[next.x][next.y]) {
            case '/':
              switch (cart.direction) {
                case '^':
                  arr[i].direction = '>';
                  break;
                case 'v':
                  arr[i].direction = '<';
                  break;
                case '<':
                  arr[i].direction = 'v';
                  break;
                case '>':
                  arr[i].direction = '^';
                  break;
              }
              break;
            case '\\':
              switch (cart.direction) {
                case '^':
                  arr[i].direction = '<';
                  break;
                case 'v':
                  arr[i].direction = '>';
                  break;
                case '<':
                  arr[i].direction = '^';
                  break;
                case '>':
                  arr[i].direction = 'v';
                  break;
              }
              break;
            case '+':
              arr[i].direction = cartsDirection[cart.direction][cart.state];
              arr[i].state = states[cart.state].next;
              break;
            case '|':
            case '-':
            default:
              break;
          }
          arr[i].x = next.x;
          arr[i].y = next.y;
        }
      });
  }

  return { crashCoords, lastCart: cartsMap.find((cart) => !cart.isDestroyed) };
};

const part1 = (content) => {
  const {
    crashCoords: [firstCrashCoords],
  } = moveCarts(content);
  return `{ x: ${firstCrashCoords.x}, y: ${firstCrashCoords.y} }`;
};

const part2 = (content) => {
  const { lastCart } = moveCarts(content);
  return `{ x: ${lastCart.x}, y: ${lastCart.y} }`;
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day13.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
