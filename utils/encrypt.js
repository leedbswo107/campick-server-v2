const bcrypt = require("bcryptjs");
require("dotenv").config();

const encrypt = (password) => {
  try {
    const saltRounds = process.env.SALT_ROUNDS || 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPW = bcrypt.hashSync(password, salt);
    return hashedPW;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { encrypt };
