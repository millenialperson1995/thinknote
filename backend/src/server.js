import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001; 

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

// Rotas
import notesRouters from "./routes/notesRoutes.js";
app.use("/v1/api/notes", notesRouters);

// Banco e servidor
import { connectDB } from "./config/db.js";
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});