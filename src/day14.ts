// Day 14: Chocolate Charts

const part1 = (content: number) => {
  const scoreboard = [3, 7];
  let firstElf = 0;
  let secondElf = 1;

  while (scoreboard.length < content + 10) {
    const newRecipe = scoreboard[firstElf] + scoreboard[secondElf];
    scoreboard.push(
      ...newRecipe
        .toString()
        .split('')
        .map((n) => parseInt(n, 10))
    );
    firstElf = (scoreboard[firstElf] + firstElf + 1) % scoreboard.length;
    secondElf = (scoreboard[secondElf] + secondElf + 1) % scoreboard.length;
  }
  return scoreboard.slice(content).join('');
};

const part2 = (content: string) => {
  const scoreboard = [3, 7];
  let firstElf = 0;
  let secondElf = 1;
  let lastScores = [];
  let found = false;

  while (!found) {
    const newRecipe = scoreboard[firstElf] + scoreboard[secondElf];
    const newItems = newRecipe
      .toString()
      .split('')
      .map((n) => parseInt(n, 10));

    for (let score of newItems) {
      scoreboard.push(score);
      lastScores =
        scoreboard.length > 6 ? scoreboard.slice(scoreboard.length - 6) : [];
      if (lastScores.length === 6 && lastScores.join('') === content) {
        found = true;
        break;
      }
    }

    firstElf = (scoreboard[firstElf] + firstElf + 1) % scoreboard.length;
    secondElf = (scoreboard[secondElf] + secondElf + 1) % scoreboard.length;
  }
  return scoreboard.length - 6;
};

(() => {
  console.log(`part1: ${part1(846601)}`);
  console.log(`part2: ${part2('846601')}`);
})();
