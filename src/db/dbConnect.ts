import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectSmriti = async () => {
  const mongoConnectionUri = process.env.SMRITI_DB_MONGO_CONNECTION_URI;
  try {
    await mongoose.connect(mongoConnectionUri as string);
    console.log("Established connection with smriti-db");
  } catch (error) {
    console.error("Failed to establish connection with smriti-db", error);
  }
};
