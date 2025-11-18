import { PrismaClient } from "@prisma/client";
import express from "express";
import petAuth  from "../../middlewares/petOwner.middleware";

const prisma = new PrismaClient();
export const petRoutes = express.Router();

petRoutes.post("/", async (req, res) => {
    const { name, age, species, breed, healthNotes } = req.body;
    const clientId = req.clientId!;

    if (!name || !species) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    try {
        const pet = await prisma.pet.create({
            data: {
                name,
                age,
                species,
                breed,
                healthNotes,
                clientId,
            },
        });

        return res.status(201).json(pet);
    } catch (err) {
        console.error("Erro ao criar pet:", err);
        return res.status(500).json({ error: "Erro interno ao criar pet" });
    }
});


petRoutes.get("/", async (req, res) => {
    const clientId = req.clientId!;

    try {
        const pets = await prisma.pet.findMany({ where: { clientId } });
        return res.status(200).json(pets);

    } catch (err) {
        console.error("Erro ao buscar pets:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


petRoutes.get("/:id", petAuth, async (req, res) => {
    return res.status(200).json(req.pet);
});

petRoutes.put("/:id", petAuth, async (req, res) => {
    const { name, age, species, breed, healthNotes } = req.body;
    const pet = req.pet!;

    try {
        const updatedPet = await prisma.pet.update({
            where: { id: pet.id },
            data: { name, age, species, breed, healthNotes, updatedAt: new Date() },
        });

        return res.status(200).json(updatedPet);
    } catch (err) {
        console.error("Erro ao atualizar pet:", err);
        return res.status(500).json({ error: "Erro interno ao atualizar pet" });
    }
});


petRoutes.delete("/:id", petAuth, async (req, res) => {
    const pet = req.pet!;

    try {
        await prisma.pet.delete({ where: { id: pet.id } });
        return res.json({ message: "Pet deletado com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar pet:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});
