import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import farmRoutes from "./routes/farm.route";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/farms", farmRoutes);

app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "success",
      message: "Sistema Porcino API funcionando correctamente",
      database: "Conectada",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error conectando a la base de datos",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
