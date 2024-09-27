const getDateNdays = async (nowDate, date) => {
  const expirationDate = new Date(nowDate);
  expirationDate.setDate(expirationDate.getDate() + date);
  return new Date(expirationDate).toISOString();
};

module.exports = {
  getDateNdays,
};
