import type { RequestHandler } from "express";

const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.clientRole) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  if (req.clientRole !== "admin") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem realizar essa ação." });
  }

  next();
};

export default isAdmin;
