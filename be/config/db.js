const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB kapcsolódva');
  } catch (err) {
    console.error('MongoDB kapcsolat hiba:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
