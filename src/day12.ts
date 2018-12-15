// Day 12: Subterranean Sustainability
import { parseFile } from 'helpers';

type Pot = {
  id: number;
  state: string;
};

const getMin = (plants: Pot[]) =>
  Math.min(...Object.values(plants).map((pot: Pot) => pot.id));

const getMax = (plants: Pot[]) =>
  Math.max(...Object.values(plants).map((pot: Pot) => pot.id));

const printPlants = (plants: Pot[], start: number, end: number) => {
  let output = '';
  for (let i = start; i <= end; i++) {
    output += plants[i] ? plants[i].state : '.';
  }
  return output;
};

const growPlants = (content, finalGen: number) => {
  const initialStateRegex = /initial state: ((?:#|\.)+)/;
  const ruleRegex = /((?:#|\.)+) => (#|\.)/g;
  const rules = [];
  const [, initialState] = initialStateRegex.exec(content);
  const generations = [
    initialState.split('').map((state, i) => ({ id: i, state })),
  ];
  const numPlants = [];

  let rule: RegExpExecArray;
  while ((rule = ruleRegex.exec(content)) !== null) {
    const [, pattern, state] = rule;
    rules.push({ pattern, state });
    ruleRegex.lastIndex;
  }
  numPlants.push(
    generations[0].reduce(
      (score, pot) => (pot.state === '#' ? score + pot.id : score),
      0
    )
  );

  for (let i = 0; i < finalGen; i++) {
    const minId = getMin(generations[i]);
    const maxId = getMax(generations[i]);
    const nextGen = [];
    const startingPots =
      generations[i].find((pot) => pot.id === minId).state +
      generations[i].find((pot) => pot.id === minId + 1).state;
    let checkLimitsStart = 0;
    if (startingPots === '.#') {
      checkLimitsStart = 1;
    } else if (startingPots === ('##' || '#.')) {
      checkLimitsStart = 2;
    }
    const endingPots =
      generations[i].find((pot) => pot.id === maxId - 1).state +
      generations[i].find((pot) => pot.id === maxId).state;
    let checkLimitsEnd = 0;
    if (endingPots === '#.') {
      checkLimitsEnd = 1;
    } else if (endingPots === ('##' || '.#')) {
      checkLimitsEnd = 2;
    }
    for (let j = minId - checkLimitsStart; j <= maxId + checkLimitsEnd; j++) {
      const { id, state } = generations[i].find((pot) => pot.id === j) || {
        id: j,
        state: '.',
      };
      const plants =
        '' +
        findPot(generations[i], id - 2) +
        findPot(generations[i], id - 1) +
        state +
        findPot(generations[i], id + 1) +
        findPot(generations[i], id + 2);
      const matchingPattern = rules.find(({ pattern }) => pattern === plants);
      const newState = matchingPattern ? matchingPattern.state : '.';
      nextGen.push({ id, state: newState });
    }
    generations.push(nextGen);
    numPlants.push(
      nextGen.reduce(
        (score, pot) => (pot.state === '#' ? score + pot.id : score),
        0
      )
    );
  }
  const score = generations[generations.length - 1].reduce(
    (score, pot) => (pot.state === '#' ? score + pot.id : score),
    0
  );

  return { score, lastGenState: generations[generations.length - 1] };
};

const part1 = (content: string[]) => growPlants(content, 20).score;

const part2 = (content: string[]) => {
  const { score, lastGenState } = growPlants(content, 120); // magic number of which I noticed the plants are doing a pattern

  const nbPlants = lastGenState.reduce(
    (nb, pot) => (pot.state === '#' ? nb + 1 : nb),
    0
  );

  return 49999999880 * nbPlants + score;
};

const findPot = (pots: Pot[], searchedId: number) => {
  const matchingPot = pots.find(({ id }) => id === searchedId);
  return matchingPot ? matchingPot.state : '.';
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day12.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
  console.log(`part2: ${part2(content)}`);
})();
