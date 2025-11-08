import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


//Executa uma função de criar um Super Admin assim que inicia o server
//Rota de criação de Admins
//Rota de promover admins

const prisma = new PrismaClient();


export async function SuperAdmin() {
	try {
		const existingAdmin = await prisma.client.findFirst({
			where: { role: "admin" },
		});

		if (existingAdmin) {
			console.log("Admin já existe:", existingAdmin.email);
			return;
		}

		const hashedPassword = await bcrypt.hash("SenhaSuperSegura123", 10);

		const superAdmin = await prisma.client.create({
			data: {
				name: "Super Admin",
				email: "superadmin@petshop.com",
				password: hashedPassword,
				role: "admin",
			},
		});

		console.log("Super admin criado com sucesso:", superAdmin.email);
	} catch (err) {
		console.error("Erro ao criar super admin:", err);
	}
}
