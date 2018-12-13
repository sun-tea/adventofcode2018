// Day 9: Marble Mania
import { parseFile } from 'helpers';

const part1 = (content) => {
  const [, nbPlayers, lastMarble] = /(\d+)\D+(\d+)/
    .exec(content)
    .map((n) => parseInt(n, 10));

  let currentMarble = 0;
  const marbles = { 0: { previous: 0, next: 0 } };
  let currentPlayer = 1;
  const scores = {};

  for (let i = 1; i <= lastMarble; i++) {
    if (currentPlayer > nbPlayers) {
      currentPlayer -= nbPlayers;
    }
    if (i % 23 === 0) {
      let marble = currentMarble;
      for (let i = 0; i < 7; i++) {
        marble = marbles[marble].previous;
      }
      scores[currentPlayer] = (scores[currentPlayer] || 0) + i + marble;
      const { previous, next } = marbles[marble];
      marbles[previous].next = next;
      marbles[next].previous = previous;
      currentMarble = next;
      delete marbles[marble];
    } else {
      const previous = marbles[currentMarble].next;
      const next = marbles[previous].next;
      marbles[i] = { previous, next };
      currentMarble = i;
      marbles[previous].next = currentMarble;
      marbles[next].previous = currentMarble;
    }
    currentPlayer++;
  }

  return Math.max(...(<number[]>Object.values(scores)));
};

(() => {
  const args = process.argv.slice(2);
  const filePath = args[0] || 'day9.txt';
  const [content] = parseFile(filePath);
  console.log(`part1: ${part1(content)}`);
})();
