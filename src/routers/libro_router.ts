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

libroRouter.patch("/libros/:id", async (req, res) => {
    try {
        const allowedUpdates = ["titulo", "autor", "anio", "editorial", "n_paginas", "genero", "resenias"];
        const actualUpdates = Object.keys(req.body);
        const isValidUpdate = actualUpdates.every((update) =>
            allowedUpdates.includes(update),
        );
        if (!isValidUpdate) {
            res.status(400).send({
                error: "Actualizacion no permitida",
            });
        } else {
            if (req.body.resenias) {
                for (const resenia of req.body.resenias) {
                    const lector = await Lector.findById(resenia.lector);

                    if (!lector) {
                        return res.status(400).send({
                            error: 'Alguno de los lectores indicados en las reseñas no existe',
                     });
                    }
                }
            }
            const newlibro = await Libro.findByIdAndUpdate({ _id: req.params.id}, req.body, {
                returnDocument: 'after',
                runValidators: true,
            }).populate('resenias.lector')

            if (!newlibro) {
                res.status(404).send({
                    error: "No se encontro el libro",
                });
            } else {
                res.send(newlibro);
            }
            
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

libroRouter.delete("/libros/:id", async (req, res) => {
    try {
        const libro = await Libro.findByIdAndDelete({_id: req.params.id})
        if (!libro) {
            res.status(404).send({
                error: "No se encontro el libro",
            });
        } else {
            res.send(libro);
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

