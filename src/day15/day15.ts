// Day 15: Beverage Bandits
import { parseFile } from '../helpers';
import {
  displayMap,
  getCardinalNeighbours,
  getRemainingHP,
  hasBattleEnded,
  sortEnemiesByProximityAndHP,
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

      // if unit does not have a team it is dead
      if (unit.team) {
        const opponentTeam = unit.team === 'E' ? 'G' : 'E';

        const enemies = getPathsToAccessibleOpponents(
          unit,
          opponentTeam,
          units,
          map
        );

        let { closestEnemies } = enemies.reduce(sortEnemiesByProximityAndHP, {
          closestEnemies: [],
          shortestPathCount: undefined,
        });

        let closestEnemy = closestEnemies[0];

        // make a move on the map
        if (closestEnemy) {
          if (closestEnemy.path.length > 0) {
            const i = units.findIndex(u => u.x === unit.x && u.y === unit.y);
            units[i].x = closestEnemy.path[0].x;
            units[i].y = closestEnemy.path[0].y;

            const result = enemies
              .map(enemy => {
                enemy.path.shift();
                return enemy;
              })
              .reduce(sortEnemiesByProximityAndHP, {
                closestEnemies: [],
                shortestPathCount: undefined,
              });
            [closestEnemy] = result.closestEnemies;
          }

          if (!closestEnemy.path.length) {
            units = attackUnit(units, closestEnemy.target);
          }
        }
      }

      // round ends prematurely if the last unit that had its turn is not the last available unit
      if (hasBattleEnded(units) && i < units.length - 1) {
        break;
      }
    }

    // a complete round is where all alive units had its turn
    // if the round is terminated because the last opponent died
    // with remaining units waiting for its turn, the round is not considered completed
    if (i === units.length) {
      round++;
      units.sort(sortUnits);
    }
  }

  const remainingHPs = getRemainingHP(units);
  const output = round * remainingHPs;
  console.log(displayMap(map, units));

  return output;
};

const attackUnit = (units: Unit[], unit: Unit) => {
  const i = units.findIndex(u => u.x === unit.x && u.y === unit.y);
  if (units[i].HP >= 3) {
    units[i].HP -= 3;
  } else {
    units[i] = {
      team: null,
      x: null,
      y: null,
      HP: 0,
    };
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
        HP: units.find(u => u.x === o.x && u.y === o.y).HP,
      },
      path: [],
    }))
    // weakest adjacent opponent takes priority
    .sort(
      (a, b) =>
        a.target.HP - b.target.HP ||
        a.target.y - b.target.y ||
        a.target.x - b.target.x
    );

  // if there is no opponent within immediate range, calculate the path
  // to get to each enemy
  return directOpponents.length
    ? directOpponents
    : units
        .filter(t => t.team === opponentTeam)
        .map(unit => {
          const availables = getCardinalNeighbours(unit, units, map).filter(
            ({ value }) => value === '.'
          );

          // if no available spot at direct surroudings of current attacker,
          // returns null path so the attacking unit knows to ignore this target
          const path = getShortestPath(attacker, availables, units, map);
          return {
            target: unit,
            path: availables.length && path ? path : null,
          };
        })
        .filter(({ path }) => path)
        .sort((a, b) => {
          const shortestPath = a.path.length - b.path.length;
          if (shortestPath !== 0) {
            return shortestPath;
          }

          for (let i = a.path.length - 1; i >= 0; i--) {
            const sort = sortUnits(a.path[i], b.path[i]);
            if (sort !== 0) {
              return sort;
            }
          }
          return 0;
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
    targetSpots.find(target => next.x === target.x && next.y === target.y)
  );

  if (!spotFound) {
    while (
      i < graph.length &&
      graph[i].nexts.filter(next =>
        targetSpots.find(target => next.x === target.x && next.y === target.y)
      ).length === 0
    ) {
      for (let pos of graph[i].nexts) {
        if (graph.find(node => node.x === pos.x && node.y === pos.y)) {
          continue;
        } else {
          graph.push(moveByOne(graph, units, map, pos));
          [spotFound] = graph[
            graph.length - 1
          ].nexts.filter((next: MapSquare) =>
            targetSpots.find(
              target => next.x === target.x && next.y === target.y
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
 * Next steps must be available spots (aka a dot) and not already visited
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
