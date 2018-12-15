// Day 12: Subterranean Sustainability
import { parseFile } from 'helpers';

const part1 = (content) => {
  const initialStateRegex = /initial state: ((?:#|\.)+)/;
  const ruleRegex = /((?:#|\.)+) => (#|\.)/g;
  const rules = [];
  const [, initialState] = initialStateRegex.exec(content);
  const generations = [
    initialState.split('').map((pot, i) => ({ id: i, pot })),
  ];

  let rule;
  while ((rule = ruleRegex.exec(content)) !== null) {
    const [, pattern, pot] = rule;
    rules.push({ pattern, pot });
    ruleRegex.lastIndex;
  }

  for (let i = 0; i < 20; i++) {
    const minId = Math.min(...Object.values(generations[i]).map((pot) => pot.id));
    const maxId = Math.max(...Object.values(generations[i]).map((pot) => pot.id));
    const nextGen = [];
    const startingPots =
      generations[i].find((pot) => pot.id === minId).pot +
      generations[i].find((pot) => pot.id === minId + 1).pot;
    let checkLimitsStart = 0;
    if (startingPots === '.#') {
      checkLimitsStart = 1;
    } else if (startingPots === ('##' || '#.')) {
      checkLimitsStart = 2;
    }
    const endingPots =
      generations[i].find((pot) => pot.id === maxId - 1).pot +
      generations[i].find((pot) => pot.id === maxId).pot;
    let checkLimitsEnd = 0;
    if (endingPots === '#.') {
      checkLimitsEnd = 1;
    } else if (endingPots === ('##' || '.#')) {
      checkLimitsEnd = 2;
    }
    for (let j = minId - checkLimitsStart; j <= maxId + checkLimitsEnd; j++) {
      const { id, pot } = generations[i].find((pot) => pot.id === j) || {
        id: j,
        pot: '.',
      };
      const plants =
        '' +
        findPot(generations[i], id - 2) +
        findPot(generations[i], id - 1) +
        pot +
        findPot(generations[i], id + 1) +
        findPot(generations[i], id + 2);
      const matchingPattern = rules.find(({ pattern }) => pattern === plants);
      const newState = matchingPattern ? matchingPattern.pot : '.';
      nextGen.push({ id, pot: newState });
    }
    generations.push(nextGen);
  }
  const score = generations[generations.length - 1].reduce(
    (score, pot) => (pot.pot === '#' ? score + pot.id : score),
    0
  );

  return score;
};

const findPot = (pots, searchedId) => {
  const matchingPot = pots.find(({ id }) => id === searchedId);
  return matchingPot ? matchingPot.pot : '.';
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day12.txt';
  const content = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
