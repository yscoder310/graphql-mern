import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected successfully");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
