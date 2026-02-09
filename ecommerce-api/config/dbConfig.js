import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
	const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

	if (!uri) {
		throw new Error("MONGO_URI is missing in environment variables");
	}

	mongoose.set("strictQuery", true);
	await mongoose.connect(uri);
	console.log("MongoDB connected");
};