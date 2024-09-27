exports.missionClearCounter = (bingoArea) => {
  let count = 0;
  bingoArea.forEach((e) => {
    if (e.state === 1) count++;
  });
  return count;
};
