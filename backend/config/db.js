const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo db connected ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`error:${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
