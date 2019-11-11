export type Map = string[][];

export type Coords = {
  x: number;
  y: number;
};

export interface MapSquare extends Coords {
  value?: string;
}

export interface Unit extends Coords {
  team: string;
  HP: number;
}

export interface PositionWithAdjacentsMoves extends Coords {
  nexts: MapSquare[];
}

export type Graph = PositionWithAdjacentsMoves[];

export const displayMap = (map: Map, units: Unit[]) => {
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

/**
 * Returns immediate neighbours (up to 4) of a given position in the map.
 * Neighbours can be units, walls or available spots.
 *
 */
export const getCardinalNeighbours = (
  coords: Coords,
  units: Unit[],
  map: Map
): MapSquare[] => {
  const neighbours = [
    {
      x: coords.x,
      y: coords.y - 1,
    },
    {
      x: coords.x - 1,
      y: coords.y,
    },
    {
      x: coords.x + 1,
      y: coords.y,
    },
    {
      x: coords.x,
      y: coords.y + 1,
    },
  ];

  return neighbours.reduce((result, n) => {
    const value = getValueOfSquare(n.x, n.y, units, map);
    return [...result, value ? { ...n, value } : {}];
  }, []);
};

/**
 * Sums all remaining HPs of units
 *
 */
export const getRemainingHP = (units: Unit[]) =>
  units.reduce((count, u) => count + u.HP, 0);

export const hasBattleEnded = (units: Unit[]) =>
  units.reduce(
    (count, u, i, units) => (u.team === units[0].team ? ++count : count),
    0
  ) === units.length
    ? true
    : false;

/**
 * Returns what is at a given position in the map. Can be a wall ('#'),
 * a team ('G' or 'E'), an available spot (a dot '.') or nothing (null, but it shouldn't be)
 *
 */
export const getValueOfSquare = (
  x: number,
  y: number,
  units: Unit[],
  map: Map
) => {
  const unit = units.find((unit) => x === unit.x && y === unit.y);
  return unit ? unit.team : map[x] ? map[x][y] : null;
};

/**
 * Sort units by their position. The moving order of units is defined by the reading order,
 * i.e. top-to-bottom, then left-to-right.
 * Must be used at the beginning of a round.
 *
 */
export const sortUnits = (a: Unit, b: Unit) => a.y - b.y || a.x - b.x;
