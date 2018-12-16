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

(() => {
  console.log(`part1: ${part1(846601)}`);
})();
