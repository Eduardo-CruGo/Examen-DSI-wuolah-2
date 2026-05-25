import express from "express";
import { Libro } from "../models/libro.js";
import { Lector } from "../models/lector.js";

export const libroRouter = express.Router();

libroRouter.post("/libros", async (req, res) => {
    const user = new Libro(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

libroRouter.get("/libros", async (req, res) => {
    try {
        const users = await Libro.find().populate('resenias.lector');
        if (users.length !== 0) {
            res.send(users);
        } else {
        res.status(404).send({
            error: "No se pudo econtrar al lector"
        });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

libroRouter.get("/libros/:id", async (req, res) => {
    try {
        const libro = await Libro.findById({ _id: req.params.id}).populate('resenias.lector')

        if (!libro) {
            res.status(404).send({
                error: "No se pudo encontrar el libro",
            });        
        } else {
            res.send(libro)
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

