import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as string;

interface AuthContent extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

const auth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET) as AuthContent;

    req.clientId = decoded.id;
    req.clientRole = decoded.role;
    req.clientEmail = decoded.email;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

export default auth;