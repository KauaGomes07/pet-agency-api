import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";

export const customerRoutes = express.Router();
const prisma = new PrismaClient();

customerRoutes.get("/", async (req, res) => {
	const clientId = req.clientId;

	if (!clientId) {
		return res.status(401).json({ error: "Usuário não autenticado" });
	}

	try {
		const customer = await prisma.client.findUnique({
			where: {
				id: clientId,
			},
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		});
		if (!customer) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		res.status(200).json({ User: customer });
	} catch (error) {
		console.error("Erro ao mostrar informações do usuário:", error);
		res.status(500).json({ error: "Erro interno do servidor" });
	}
});

customerRoutes.put("/", async (req, res) => {
	const clientId = req.clientId;

	if (!clientId) {
		return res.status(401).json({ error: "Usuário não autenticado" });
	}
	const { name, email } = req.body;

	try {
		const updated = await prisma.client.update({
			where: {
				id: clientId,
			},
			data: {
				...(name && { name }),
				...(email && { email }),
			},
			select: {
				id: true,
				name: true,
				email: true,
				updatedAt: true,
			},
		});

		return res
			.status(200)
			.json({ message: "Perfil atualizado com sucesso", user: updated });
	} catch (error) {
		console.error("Erro ao atualizar perfil:", error);
		return res.status(500).json({ error: "Erro interno do servidor" });
	}
});

customerRoutes.put("/password", async (req, res) => {
	const clientId = req.clientId;

	if (!clientId) {
		return res.status(401).json({ error: "Usuário não autenticado" });
	}

	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return res
			.status(400)
			.json({ error: "Envie a senha atual e a nova senha" });
	}

	try {
		const user = await prisma.client.findUnique({
			where: { id: clientId },
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		const passwordMatch = await bcrypt.compare(currentPassword, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: "Senha atual incorreta" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await prisma.client.update({
			where: { id: clientId },
			data: { password: hashedPassword },
		});

		return res.status(200).json({ message: "Senha alterada com sucesso" });
	} catch (error) {
		console.error("Erro ao alterar senha:", error);
		return res.status(500).json({ error: "Erro interno do servidor" });
	}
});

customerRoutes.delete("/", async (req, res) => {
	const clientId = req.clientId;

	if (!clientId){
		return res.status(401).json({ error: "Usuário não autenticado" });
	}

	try {
		await prisma.client.delete({
			where: {
				id: clientId
			}
		}) 

		return res.status(200).json({ message: "Conta excluída com sucesso" });
	}
	catch(error){
		console.error("Erro ao excluir conta:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
	}
})