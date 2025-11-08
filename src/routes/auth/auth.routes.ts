import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import isAdmin from "../../middlewares/admin.middleware";

const prisma = new PrismaClient();
export const adminRoutes = express.Router();

//Rota de criar um usuário admin

adminRoutes.post("/admin", isAdmin, async (req, res) => {
	try {
		const { email, name, password } = req.body;

		const hashPassword = await bcrypt.hash(password, 10);

		const newAdmin = await prisma.client.create({
			data: {
				email: email,
				name: name,
				password: hashPassword,
				role: "admin",
			},
		});
		const { password: _, ...AdminWithoutPassword } = newAdmin;

		res.status(201).json({ message: "Admin criado!", AdminWithoutPassword });
	} catch (err) {
		res.status(500).json({ message: "Erro ao criar admin, tente novamente." });
	}
});

//Rota de promover a admin

adminRoutes.patch("/admin/:id", isAdmin, async (req, res) => {
	try {
		const id = req.params.id as string;
		const role = req.body.role;

		const userExists = await prisma.client.findUnique({ where: { id } });

		if (!userExists) {
			return res.status(404).json({ message: "Usuário não encontrado" });
		}

		const user = await prisma.client.update({
			where: { id },
			data: { role: role },
		});

		const { password, email: _, ...Admin } = user;

		return res.json({ message: "Usuário promovido a admin!", Admin });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Erro ao promover usuário" });
	}
});
