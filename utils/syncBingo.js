exports.syncBingo = (curBingo, newBingo) => {
  Array.from(curBingo.bingo).forEach((e) => {
    newBingo.forEach((element) => {
      if (e.mission === element.mission) {
        [e.state, element.state] = [element.state, e.state];
      }
    });
  });
  return curBingo;
};
