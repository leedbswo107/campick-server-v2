exports.bingoMission = (mission) => {
  const {
    reviewCount,
    postCount,
    missionClear,
    bingoCount,
    continuousConnection,
  } = mission;
  const bingoMission = [
    { mission: 1, state: reviewCount >= 3 ? 1 : 0 },
    { mission: 2, state: postCount >= 2 ? 1 : 0 },
    { mission: 3, state: missionClear >= 3 ? 1 : 0 },
    { mission: 4, state: bingoCount >= 2 ? 1 : 0 },
    { mission: 5, state: reviewCount >= 5 ? 1 : 0 },
    { mission: 6, state: postCount >= 4 ? 1 : 0 },
    { mission: 7, state: continuousConnection >= 3 ? 1 : 0 },
    { mission: 8, state: missionClear >= 6 ? 1 : 0 },
    { mission: 9, state: continuousConnection >= 7 ? 1 : 0 },
  ];
  return bingoMission;
};
