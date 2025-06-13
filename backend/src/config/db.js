import mongoose from "mongoose";

/**
 * Função responsável por conectar à base de dados MongoDB.
 */
export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("❌ MONGODB_URI environment variable is not defined.");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Encerra o processo com código de erro
  }
};