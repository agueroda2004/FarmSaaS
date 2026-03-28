import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import farmRoutes from "./routes/farm.route";
import userRoutes from "./routes/user.route";
import raceRoutes from "./routes/race.route";
import locationRoutes from "./routes/location.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/farms", farmRoutes);
app.use("/api/users", userRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/locations", locationRoutes);

// Function to gracefully shutdown the server and disconnect Prisma, it will close the database connection when the server is stopped.
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
