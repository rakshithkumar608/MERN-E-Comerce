const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/rabbit";

  try {
    if (primaryUri) {
      try {
        await mongoose.connect(primaryUri);
        console.log("MongoDB connected to primary URI successfully");
        return;
      } catch (primaryErr) {
        console.warn("Primary MongoDB connection failed, attempting local fallback:", primaryErr.message);
      }
    }
    await mongoose.connect(localUri);
    console.log("MongoDB connected to local database (mongodb://127.0.0.1:27017/rabbit) successfully");
  } catch (err) {
    console.error("MongoDB connection failed completely:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
