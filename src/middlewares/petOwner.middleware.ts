import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

const ensurePetOwner: RequestHandler = async (req, res, next) => {
	const { id } = req.params;
	const clientId = req.clientId;

	if (!clientId) {
		return res.status(401).json({ error: "Usuário não autenticado" });
	}

	if (!id || id.length !== 24) {
		return res.status(400).json({ error: "ID inválido" });
	}

	try {
		const pet = await prisma.pet.findUnique({
			where: { id },
		});

		if (!pet) {
			return res.status(404).json({ error: "Pet não encontrado" });
		}

		if (pet.clientId !== clientId) {
			return res
				.status(403)
				.json({ error: "Você não tem permissão para acessar esse pet" });
		}

		req.pet = pet;

		return next();
	} catch (err) {
		console.error("Erro no ensurePetOwner:", err);
		return res.status(500).json({ error: "Erro interno do servidor" });
	}
};

export default ensurePetOwner