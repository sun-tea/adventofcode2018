// Day 15: Beverage Bandits
import { parseFile } from 'helpers';

type Map = string[][];

type Unit = {
  x: number;
  y: number;
  team: string;
  HP: number;
};

type MapSquare = {
  x: number;
  y: number;
  value?: string;
};

const displayMap = (map: Map, units: Unit[]) => {
  const displayedMap = map.reduce(
    (displayedMap, row, x) => {
      const lines = row.reduce((lines, value, y) => {
        const unit = units.find((unit) => unit.x === x && unit.y === y);
        const squareValue = unit ? unit.team : value;
        if (lines[y]) {
          lines[y] += squareValue;
        } else {
          lines[y] = squareValue;
        }
        return lines;
      }, displayedMap);
      return lines;
    },
    ['']
  );

  return displayedMap;
};

const part1 = (content) => {
  const map: Map = [];
  const units: Unit[] = [];

  content.forEach((line, y: number) => {
    line.split('').forEach((char, x: number) => {
      map[x] = map[x] ? map[x] : [];
      if (['E', 'G'].includes(char)) {
        units.push({ team: char, x, y, HP: 200 });
        map[x][y] = '.';
      } else {
        map[x][y] = char;
      }
    });
  });

  let round = 1;
  while (!isBattleEnded(units)) {
    for (let unit of units) {
      const opponentTeam = unit.team === 'E' ? 'G' : 'E';
      const enemies = getOpponents(unit, opponentTeam, units, map);
      let shortestSteps;

      const closestEnemies = enemies.reduce((closestEnemies, enemy, i) => {
        if (enemy.path) {
          if (i === 0 || enemy.path.length < shortestSteps) {
            shortestSteps = enemy.path.length;
            return [enemy];
          } else if (enemy.path.length === shortestSteps) {
            return [...closestEnemies, enemy];
          } else {
            return closestEnemies;
          }
        }
        return closestEnemies;
      }, []);

      const closestEnemy = closestEnemies[0];
      // attack
      if (closestEnemy) {
        if (closestEnemy.path.length === 0) {
          const i = units.findIndex(
            (u) => u.x === closestEnemy.target.x && u.y === closestEnemy.target.y
          );
          units[i].HP -= 3;
          if (units[i].HP <= 0) {
            units.splice(i, 1);
          }
        } else if (closestEnemy.path.length === 1) {
          const i = units.findIndex((u) => u.x === unit.x && u.y === unit.y);
          units[i].x = closestEnemy.path[0].x;
          units[i].y = closestEnemy.path[0].y;
          const enemyIndex = units.findIndex(
            (u) => u.x === closestEnemy.target.x && u.y === closestEnemy.target.y
          );
          units[enemyIndex].HP -= 3;
          if (units[enemyIndex].HP <= 0) {
            units.splice(enemyIndex, 1);
          }
        } else {
          const i = units.findIndex((u) => u.x === unit.x && u.y === unit.y);
          units[i].x = closestEnemy.path[0].x;
          units[i].y = closestEnemy.path[0].y;
        }
      }

      if (isBattleEnded(units)) {
        break;
      }
    }
    round++;
  }

  // console.log(round);
  // console.log(remainingHP(units));
  // console.log(round * remainingHP(units));
  // console.log(displayMap(map, units));
};

const remainingHP = (units: Unit[]) =>
  units.reduce((count, u) => count + u.HP, 0);

const isBattleEnded = (units: Unit[]) =>
  units.reduce(
    (count, u, i, units) => (u.team === units[0].team ? ++count : count),
    0
  ) === units.length
    ? true
    : false;

const getOpponents = (
  attacker: Unit,
  opponentTeam: string,
  units: Unit[],
  map: Map
) => {
  const directOpponents = getCardinalNeighbours(attacker, units, map)
    .filter(({ value }) => value === opponentTeam)
    .map((o) => ({
      target: { x: o.x, y: o.y },
      path: [{ x: attacker.x, y: attacker.y }],
    }));
  // if there is no opponent within immediate range, calculate the path
  // to get to each enemy
  return directOpponents.length
    ? directOpponents
    : units
        .filter((t) => t.team === opponentTeam)
        .map((unit) => {
          const availables = getCardinalNeighbours(unit, units, map).filter(
            ({ value }) => value === '.'
          );

          // if availables is empty, returns null path so the unit won't do anything
          return {
            target: unit,
            path: availables.length
              ? getShortestPath(attacker, availables, units, map)
              : null,
          };
        });
};

const getCardinalNeighbours = (
  unit: Unit | MapSquare,
  units: Unit[],
  map: Map
): MapSquare[] => {
  const up = {
    x: unit.x,
    y: unit.y - 1,
    value: getValueOfSquare(unit.x, unit.y - 1, units, map),
  };
  const left = {
    x: unit.x - 1,
    y: unit.y,
    value: getValueOfSquare(unit.x - 1, unit.y, units, map),
  };
  const right = {
    x: unit.x + 1,
    y: unit.y,
    value: getValueOfSquare(unit.x + 1, unit.y, units, map),
  };
  const down = {
    x: unit.x,
    y: unit.y + 1,
    value: getValueOfSquare(unit.x, unit.y + 1, units, map),
  };

  return [up, left, right, down].filter(({ value }) => value && value !== '#');
};

const getValueOfSquare = (x: number, y: number, units: Unit[], map: Map) => {
  const unit = units.find((unit) => x === unit.x && y === unit.y);
  return unit ? unit.team : map[x] ? map[x][y] : null;
};

/**
 * Get shortest paths to reach an enemy. There could be multiple paths
 * with the same move cost.
 *
 * @param attacker
 * @param availablesSpots
 * @param map
 */
const getShortestPath = (
  attacker: Unit,
  targetSpots: MapSquare[],
  units: Unit[],
  map: Map
) => {
  let start = attacker;
  const graph = [moveByOne([], units, map, start)];
  let i = 0;
  let spotFound;
  [spotFound] = graph[i].nexts.filter((next) =>
    targetSpots.find((target) => next.x === target.x && next.y === target.y)
  );

  if (!spotFound) {
    while (
      i < graph.length &&
      graph[i].nexts.filter((next) =>
        targetSpots.find((target) => next.x === target.x && next.y === target.y)
      ).length === 0
    ) {
      for (let pos of graph[i].nexts) {
        if (graph.find((node) => node.x === pos.x && node.y === pos.y)) {
          continue;
        } else {
          graph.push(moveByOne(graph, units, map, pos));
          [spotFound] = graph[graph.length - 1].nexts.filter((next) =>
            targetSpots.find(
              (target) => next.x === target.x && next.y === target.y
            )
          );

          if (spotFound) {
            break;
          }
        }
      }
      if (spotFound) {
        break;
      } else {
        i++;
      }
    }
  }

  const path: MapSquare[] = [];
  const { x, y } = spotFound;
  path.unshift({ x, y });

  while (true) {
    const { x: lastX, y: lastY } = path[0];
    const parent = graph.find(
      ({ nexts }) => !!nexts.find((node) => node.x === lastX && node.y === lastY)
    );
    if (parent && !(parent.x === attacker.x && parent.y === attacker.y)) {
      path.unshift({ x: parent.x, y: parent.y });
    } else {
      break;
    }
  }

  return path;
};

/**
 * Get the next possible steps from a given point.
 * Next steps must be available spots (aka a dot)
 *
 * @param map
 * @param start
 */
const moveByOne = (
  graph,
  units: Unit[],
  map: Map,
  start: Unit | MapSquare
) => ({
  x: start.x,
  y: start.y,
  nexts: getCardinalNeighbours(start, units, map).filter(
    ({ x, y, value }) =>
      value === '.' && !graph.find((n) => n.x === x && n.y === y)
  ),
});

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day15.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
