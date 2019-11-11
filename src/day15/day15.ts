// Day 15: Beverage Bandits
import { parseFile } from '../helpers';
import {
  displayMap,
  getCardinalNeighbours,
  getRemainingHP,
  hasBattleEnded,
  sortUnits,
  Coords,
  Graph,
  Map,
  MapSquare,
  PositionWithAdjacentsMoves,
  Unit,
} from './utils';

const part1 = (content: string[]) => {
  const map: Map = [];
  let units: Unit[] = [];

  content.forEach((line: string, y: number) => {
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

  let round = 0;
  while (!hasBattleEnded(units)) {
    let i = 0;
    for (i; i < units.length; i++) {
      let unit = units[i];
      const opponentTeam = unit.team === 'E' ? 'G' : 'E';
      const enemies = getPathsToAccessibleOpponents(
        unit,
        opponentTeam,
        units,
        map
      );
      let shortestSteps: number;

      const closestEnemies = enemies.reduce(
        (closestEnemies: { target: Unit; path: Coords[] }[], enemy) => {
          if (enemy.path) {
            if (
              typeof shortestSteps === 'undefined' ||
              enemy.path.length < shortestSteps
            ) {
              shortestSteps = enemy.path.length;
              return [enemy];
            } else if (enemy.path.length === shortestSteps) {
              return [...closestEnemies, enemy];
            } else {
              return closestEnemies;
            }
          }
          return closestEnemies;
        },
        []
      );

      const closestEnemy = closestEnemies[0];

      // console.log('attacking unit:', unit);
      // console.log('attacked unit:', closestEnemy);

      // make a move on the map
      if (closestEnemy) {
        if (closestEnemy.path.length > 0) {
          const i = units.findIndex((u) => u.x === unit.x && u.y === unit.y);
          units[i].x = closestEnemy.path[0].x;
          units[i].y = closestEnemy.path[0].y;
        }

        if ([0, 1].includes(closestEnemy.path.length)) {
          units = attackUnit(units, closestEnemy.target);
        }
      }

      if (hasBattleEnded(units)) {
        break;
      }
    }
    if (i === units.length) {
      round++;
    }
    units.sort(sortUnits);

    // console.log('round:', round);
    // console.log(displayMap(map, units));
    // console.log(units);
  }

  // console.log(round);
  const remainingHPs = getRemainingHP(units);
  const output = round * remainingHPs;
  // console.log(displayMap(map, units));

  return output;
};

const attackUnit = (units: Unit[], unit: Unit) => {
  const i = units.findIndex((u) => u.x === unit.x && u.y === unit.y);
  units[i].HP -= 3;
  if (units[i].HP <= 0) {
    units.splice(i, 1);
  }
  return units;
};

const getPathsToAccessibleOpponents = (
  attacker: Unit,
  opponentTeam: string,
  units: Unit[],
  map: Map
): { target: Unit; path: Coords[] }[] => {
  const directOpponents = getCardinalNeighbours(attacker, units, map)
    .filter(({ value }) => value === opponentTeam)
    .map((o: MapSquare) => ({
      target: {
        x: o.x,
        y: o.y,
        team: o.value,
        HP: units.find((u) => u.x === o.x && u.y === o.y).HP,
      },
      path: [{ x: attacker.x, y: attacker.y }],
    }))
    .sort((a, b) => a.target.HP - b.target.HP);
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

          // if no available spot at direct surroudings of current attacker,
          // returns null path so the unit won't do anything
          return {
            target: unit,
            path: availables.length
              ? getShortestPath(attacker, availables, units, map)
              : null,
          };
        });
};

/**
 * Get shortest paths to reach an enemy. There could be multiple possible
 * paths with the same move cost.
 *
 */
const getShortestPath = (
  attacker: Unit,
  targetSpots: MapSquare[],
  units: Unit[],
  map: Map
): MapSquare[] => {
  let start = attacker;
  const graph = [moveByOne([], units, map, start)];
  let i = 0;
  let spotFound: MapSquare;
  [spotFound] = graph[i].nexts.filter((next: MapSquare) =>
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
          [spotFound] = graph[graph.length - 1].nexts.filter(
            (next: MapSquare) =>
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

  if (spotFound) {
    // graph.map((coords) => {
    //   console.log(coords.x, coords.y);
    //   console.log(coords.nexts.map((c) => c));
    // });
    // console.log('----');

    const path: MapSquare[] = [];
    const { x, y } = spotFound;
    path.unshift({ x, y });

    while (true) {
      const { x: lastX, y: lastY } = path[0];
      const parent = graph.find(
        ({ nexts }) =>
          !!nexts.find(
            (node: MapSquare) => node.x === lastX && node.y === lastY
          )
      );
      if (parent && !(parent.x === attacker.x && parent.y === attacker.y)) {
        path.unshift({ x: parent.x, y: parent.y });
      } else {
        break;
      }
    }

    return path;
  } else {
    // there is no possible path to get to the target
    return null;
  }
};

/**
 * Get the next possible steps from a given point.
 * Next steps must be available spots (aka a dot)
 *
 */
const moveByOne = (
  graph: Graph,
  units: Unit[],
  map: Map,
  coords: Coords
): PositionWithAdjacentsMoves => ({
  x: coords.x,
  y: coords.y,
  nexts: getCardinalNeighbours(coords, units, map).filter(
    ({ x, y, value }) =>
      value === '.' &&
      !graph.find((n: PositionWithAdjacentsMoves) => n.x === x && n.y === y)
  ),
});

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day15.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
