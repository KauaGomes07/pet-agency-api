import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
export const schedulingRoutes = express.Router();

schedulingRoutes.post("/", async (req, res) => {
	const { nomePet, servico, data, horario } = req.body;
	const clientId = req.clientId;

	if (!clientId) {
		return res.status(401).json({ error: "Usuário não autenticado" });
	}
	if (!nomePet || !servico || !data || !horario) {
		return res.status(400).json({ error: "Campos obrigatórios faltando" });
	}

	try {
		const horarioExistente = await prisma.agendamento.findUnique({
			where: { horario },
		});

		if (horarioExistente) {
			return res.status(400).json({ error: "Horário já agendado" });
		}

		const agendamento = await prisma.agendamento.create({
			data: {
				nomePet: nomePet,
				servico: servico,
				data: data,
				horario: horario,
				clientId,
			},
		});

		res.status(201).json({ message: "Agendamento confirmado!", agendamento });
	} catch (error) {
		console.error("Erro ao criar agendamento:", error);
		res.status(500).json({ error: "Erro interno ao criar agendamento" });
	}
});

schedulingRoutes.get("/", async (req, res) => {
	const clientId = req.clientId!;

	try {
		const agendamentos = await prisma.agendamento.findMany({
			where: { clientId },
			orderBy: { data: "asc" },
		});

		res.status(200).json(agendamentos);
	} catch (error) {
		console.error("Erro ao buscar agendamentos:", error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
});

//Esse id aqui que refere-se ao id "criado para o pet" ao fazer o agendamento

schedulingRoutes.delete("/:id", async (req, res) => {
	const { id } = req.params;
	const clientId = req.clientId;

	if (!id) {
		return res.status(400).json({ error: "ID do agendamento é obrigatório" });
	}

	try {
		const agendamento = await prisma.agendamento.findUnique({
			where: {
				id: id,
			},
		});

		if (!agendamento) {
			return res.status(404).json({ error: "Agendamento não encontrado" });
		}

		if (agendamento.clientId !== clientId) {
			return res.status(403).json({ error: "Você não tem permissão para cancelar este agendamento" });
		}

		await prisma.agendamento.delete({ where: { id } });
		res.json({ message: "Agendamento cancelado com sucesso!" });
	} catch (error) {
		res.status(500).json({ error: "Erro ao deletar agendamento" });
	}
});
