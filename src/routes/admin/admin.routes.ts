import { PrismaClient } from "@prisma/client";
import express from "express";

export const adminRoutes = express.Router();

const prisma = new PrismaClient();

adminRoutes.get("/users", async (_, res) => {
	try {
		const clients = await prisma.client.findMany({ omit: { password: true } });

		res.status(200).json(clients);
	} catch (err) {
		console.error("Erro ao obter dados dos usuários.", err);
		res.status(500).json({ message: "Erro no servidor" });
	}
});

adminRoutes.get("/schedulings", async (_, res) => {
	try {
		const agendamentos = await prisma.agendamento.findMany();
		res.status(200).json(agendamentos);
	} catch (err) {
		console.error("Erro ao listar agendamentos:", err);
		res.status(500).json({ message: "Erro no servidor" });
	}
});

adminRoutes.delete("/:id", async (req, res) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).json({ error: "ID do usuário é obrigatório" });
	}

	try {
		const usuario = await prisma.client.findUnique({
			where: {
				id: id,
			},
		});
		if (!usuario) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		if (req.clientId === id) {
			return res
				.status(403)
				.json({ error: "Você não pode deletar a si mesmo." });
		}

		await prisma.agendamento.deleteMany({
			where: { clientId: id },
		});

		await prisma.client.delete({
			where: { id },
		});
		return res.status(200).json({ message: "Usuário deletado com sucesso!" });
	} catch (error) {
		res.status(500).json({ error: "Erro ao deletar usuário" });
	}
})


adminRoutes.delete("/scheduling/:id", async (req, res) => {
	const id = req.params.id as string;

	if (!id) {
		return res.status(400).json({ error: "ID do agendamento é obrigatório" });
	}

	try {
		const agendamento = prisma.agendamento.findUnique({
			where: {
				id: id,
			},
		});

		if (!agendamento) {
			return res.status(404).json({ error: "Agendamento não encontrado." });
		}

		await prisma.agendamento.delete({
			where: {
				id: id,
			},
		});
		res.json({ message: "Agendamento cancelado com sucesso!" });
	} catch (error) {
		res.status(500).json({ error: "Erro ao deletar agendamento" });
	}
});
