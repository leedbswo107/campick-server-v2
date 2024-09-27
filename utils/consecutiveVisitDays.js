exports.consecutiveVisitDays = (dateArr) => {
  const dataFormConvertedArr = Array.from(dateArr).map((date) =>
    date.slice(0, 10)
  );

  const duplicateRemove = new Set(dataFormConvertedArr);
  const filteredArr = [...duplicateRemove];
  const convertedDateArray = filteredArr.map(
    (date) => new Date(date).getTime() / (1000 * 60 * 60 * 24)
  );
  convertedDateArray.sort((a, b) => a - b);
  let count = 1;
  for (let i = 0; i < convertedDateArray.length - 1; i++) {
    const diff = convertedDateArray[i + 1] - convertedDateArray[i];
    diff === 1 ? true : false;
    if (!diff) {
      return diff;
    }
    count++;
  }
  return count;
};
