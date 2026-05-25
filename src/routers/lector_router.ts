import express from 'express';
import { Lector } from '../models/lector.js';
import { Libro } from '../models/libro.js';

export const lectorRouter = express.Router();

lectorRouter.post('/lectores', async (req, res) => {
  const note = new Lector(req.body);
    try {
        await note.save();
        res.status(201).send(note);
    } catch (error) {
        res.status(500).send(error);
    }
});

lectorRouter.get("/lectores", async (req, res) => {
    const filter = req.query.nombre_usr
    ? { nombre_usr: req.query.nombre_usr.toString() }
    : {};
    try {
        const users = await Lector.find(filter);

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
})

lectorRouter.patch('/lectores', async (req, res) => {
    if (!req.query.nombre_usr) {
        return res.status(400).send({
            error: 'Se tiene que introducir un nombre de usuario',
        });
    }

    const allowedUpdates = ['nombre', 'nombre_usr', 'mail', 'generos_fav'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
        allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
        return res.status(400).send({
        error: 'Actualización no permitida',
        });
    }

    try {
        const lector = await Lector.findOneAndUpdate(
            {
                nombre_usr: req.query.nombre_usr.toString(),
            },
                req.body,
            {
                returnDocument: 'after',
                runValidators: true,
            },
        );

        if (lector) {
            res.send(lector);
        } else {
            res.status(404).send({
                error: "No se encontro al lector"
            });        
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

lectorRouter.delete('/lectores', async (req, res) => {
    if (!req.query.nombre_usr) {
        res.status(400).send({
            error: 'Se tiene que introducir un nombre de usuario',
        })
    } else {
        try {
            const lector = await Lector.findOne({
                nombre_usr: req.query.nombre_usr.toString(),
            });

            if (!lector) {
                res.status(404).send({
                    error: 'No se pudo econtrar al lector'
                });
            } else {
                const libros = await Libro.find({ 'resenias.lector': lector._id });
                
                for (const libro of libros) {
                    libro.resenias = libro.resenias.filter((resenia) =>
                        resenia.lector.toString() !== lector._id.toString()
                    );
                    await libro.save();
                }
                if (!libros) {
                    res.status(500).send();
                } else {
                    await Lector.findByIdAndDelete(lector._id);
                    res.send(lector);
                }
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
});