const mongoose = require('mongoose');

exports.connectDB = async () => {
  try {
    const connectUri = process.env.DB_KEYS;
    await mongoose.connect(connectUri);
    console.log('DB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
