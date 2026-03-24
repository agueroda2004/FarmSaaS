import { NextFunction, Request, Response } from "express";
import { Client, Account } from "node-appwrite";

// Extendemos la interfaz de Express para poder inyectar el usuario validado
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Extraemos el token del encabezado (Header) "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({ status: "error", message: "No Autorizado" });
      return;
    }

    const jwt = authHeader.split(" ")[1];

    // 2. Configuramos el cliente de Appwrite con el JWT del usuario
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
      .setProject(process.env.APPWRITE_PROJECT_ID as string)
      .setJWT(jwt); // ¡Esta es la clave! El cliente ahora actúa en nombre de ese usuario

    // 3. Verificamos si el token es válido obteniendo el perfil del usuario
    const account = new Account(client);
    const user = await account.get();

    // 4. Si es válido, guardamos los datos del usuario en la petición para que el controlador los use
    req.user = {
      id: user.$id,
      email: user.email,
      name: user.name || "Unkwon User",
    };

    // 5. Le decimos a Express: "Todo en orden, que pase al controlador"
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res
      .status(401)
      .json({ status: "error", message: "Token inválido o expirado." });
  }
};
