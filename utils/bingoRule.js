const { BINGO_PATTERN } = require("../constants/bingoPattern");
exports.bingoRule = (bingoArea) => {
  const data = {
    count: 0,
    bingoPattern: new Array(BINGO_PATTERN.length).fill(0),
  };
  const isBingo = (pattern) =>
    pattern.every((index) => bingoArea[index].state === 1);
  BINGO_PATTERN.forEach((pattern, i) => {
    if (isBingo(pattern)) {
      data.bingoPattern[i] = 1;
      data.count++;
    }
  });
  return data;
};
