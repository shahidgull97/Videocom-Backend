import mongoose from "mongoose";
const baseUrl = process.env.MONGODB || "0.0.0.0:27017";
export const connectDB = async () => {
  try {
    console.log("db is connecting...");
    const res = await mongoose.connect(`mongodb://${baseUrl}/videocall`);
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed!");
    console.log(error);
  }
};
