import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export const publicRoutes = express.Router();

//Cadastro

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as string;

publicRoutes.post("/register", async (req, res) => {
	try {
		const { email, name, password } = req.body;

		const hashPassword = await bcrypt.hash(password, 10);

		const client = await prisma.client.create({
			data: {
				email: email,
				name: name,
				password: hashPassword,
			},
		});
		const { password: _, ...clientWithoutPassword } = client;

		res.status(201).json(clientWithoutPassword);
	} catch (err) {
		res.status(500).json({ message: "Erro no servidor, tente novamente." });
	}
});

//Login

publicRoutes.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const client = await prisma.client.findUnique({
			where: {
				email: email,
			},
		});

		if (!client) {
			return res.status(404).json({ message: "Usuário não existe!" });
		}

		const isMatch = await bcrypt.compare(password, client.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Senha inválida!" });
		}

		const token = jwt.sign(
			{ id: client.id, email: client.email, role: client.role },
			JWT_SECRET,
			{ expiresIn: "10m" },
		);

		const payload = {
			token
		}
		res.status(200).json(payload);
		
	} catch (err) {
		res
			.status(401)
			.json({
				message:
					"Erro ao realizar o login. Reveja suas informações e tente novamente",
			});
	}
});
